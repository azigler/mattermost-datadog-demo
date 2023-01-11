#!/bin/bash

echo "Initializing Mattermost for demo..."

sleep 25

docker exec mattermost mmctl --local user create --username root --password mattermost --email example@test.com --system-admin --email-verified
docker exec mattermost mmctl --local team create --display-name "Plantalytics, Inc." --name main
docker exec mattermost mmctl --local channel create --team main --display-name "Datadog Alerts" --name datadog-alerts
docker exec mattermost mmctl --local team users add main root
docker exec mattermost mmctl --local channel users add main:datadog-alerts root

export MM_URL="$(gp url 8065)"

docker exec mattermost mmctl --local user create --username zeke --password zekemattermost --email zeke@test.com --email-verified
docker exec mattermost mmctl --local team users add main zeke
docker exec mattermost mmctl --local channel users add main:datadog-alerts zeke

echo "\n  YOU CAN NOW LOG IN TO MATTERMOST AT $MM_URL\n        username:  root\n        password:  mattermost\n"

docker exec mattermost mmctl auth login $MM_URL --name zeke --username zeke --password-file /credentials/zeke.txt

docker exec mattermost mmctl post create main:town-square --message "Hey @root, it's me, Zeke! We're so glad you're finally here. Can you help us set up alerts with the new Datadog Agent monitoring our containers? I'm going to move discussion over to [Datadog Alerts channel]($MM_URL/main/channels/datadog-alerts) to reduce noise here..."

sleep 10

docker exec mattermost mmctl post create main:datadog-alerts --message "Hey @root, over here! :) :tada: To get started, log into your Datadog account and navigate to the **[Integrations > Webhooks](https://app.datadoghq.com/integrations/webhooks)** page. The alert we need to create is for the \`plantalytics\` API we just rolled out. If the API encounters some edge cases that ours engineers have identified, we want to get notified so we can investigate the causes."

sleep 10

docker exec mattermost mmctl post create main:datadog-alerts --message "First, **[create a new incoming webhook in Mattermost for this channel]($MM_URL/main/integrations/incoming_webhooks/add)** and copy its URL."

sleep 15

docker exec mattermost mmctl post create main:datadog-alerts --message "Next, **create a new webhook on Datadog** and name it \`mattermost-integration\`. You can paste in the webhook URL. For the payload, let's use a formatted message attachment in Mattermost:

\`\`\`json
{
  \"attachments\": [
      {
          \"fallback\": \"$EVENT_MSG\",
          \"color\": \"#FF8000\",
          \"pretext\": \"This is optional pretext that shows above the attachment.\",
          \"text\": \"$EVENT_MSG\",
          \"author_name\": \"Datadog\",
          \"author_icon\": \"https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png\",
          \"author_link\": \"https://mattermost.org/\",
          \"title\": \"🚨 $EVENT_TYPE\",
          \"title_link\": \"https://developers.mattermost.com/integrate/reference/message-attachments/\",
          \"fields\": [
              {
                  \"short\":true,
                  \"title\":\"Last Updated\",
                  \"value\":\"$LAST_UPDATED\"
              },
              {
                  \"short\":true,
                  \"title\":\"ID\",
                  \"value\":\"$ID\"
              },
              {
                  \"short\":false,
                  \"title\":\"Organization\",
                  \"value\":\"$ORG_NAME\"
              }
          ],
          \"image_url\": \"https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png\"
      }
  ]
}
\`\`\`"

docker exec mattermost mmctl post create main:datadog-alerts --message "Next, navigate to the **[Monitors > New Monitor > Logs](https://app.datadoghq.com/monitors/create/log)** page to create this new log monitor. The Datadog Agent is already online and scanning our containers, you check out the \`docker-compose.yml\` file in the repo to see how it's configured but that's not necessary for now."

sleep 15

docker exec mattermost mmctl post create main:datadog-alerts --message "In **Define the search query**, you can start typing \`container_name:\` and it'll suggest the running containers. We want to monitor \`container_name:plantalytics\` so type that in. After that selector, enter the plain text we want to look for with the monitor. Let's add \"almost out of plants\" so now the field says \`container_name:plantalytics almost out of plants\`."

sleep 15

docker exec mattermost mmctl post create main:datadog-alerts --message "Under **Set alert conditions**, change it to be \`above or equal to\` and set the **Alert Threshold** to \`1\`"

sleep 15

docker exec mattermost mmctl post create main:datadog-alerts --message "Under **Notify your team**, set the monitor title to whatever you like and in the body add \`@mattermost-integration\` so that this monitor sends the alert we formatted for this channel. You should test the notification to make sure it sends here, then save it."

sleep 15
