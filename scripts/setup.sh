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

docker exec mattermost mmctl post create main:off-topic --message "Hey @root, it's me, Zeke! I'm so glad you're finally here. Can you help us set up alerts for our new API? I'm going to move discussion over to [Datadog Alerts channel]($MM_URL/main/channels/datadog-alerts) to reduce noise here..."

sleep 5

docker exec mattermost mmctl post create main:datadog-alerts --message "Yay, you're here! :tada: To get started, log into your Datadog account and navigate to the **[Integrations > Webhooks](https://app.datadoghq.com/integrations/webhooks)** page. The alert we need to create is for the \`plantalytics\` API we just rolled out. If the API encounters some edge cases that ours engineers have identified, we want to get notified so we can investigate the causes."

sleep 2

docker exec mattermost mmctl post create main:datadog-alerts --message "First, **[create a new incoming webhook in Mattermost for this channel]($MM_URL/main/integrations/incoming_webhooks/add)** and copy its URL."

sleep 5

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