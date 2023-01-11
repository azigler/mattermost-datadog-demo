#!/bin/bash

echo "Initializing Mattermost for demo..."

sleep 25

docker exec mattermost mmctl --local user create --username root --password mattermost --email example@test.com --system-admin --email-verified
docker exec mattermost mmctl --local team create --display-name "Plantalytics, Inc." --name main
docker exec mattermost mmctl --local channel create --team main --display-name "Datadog Alerts" --name datadog-alerts
docker exec mattermost mmctl --local team users add main root
docker exec mattermost mmctl --local channel users add main:datadog-alerts root

export GP_URL="$(gp url)"

docker exec mattermost mmctl --local user create --username zeke --password zekemattermost --email zeke@test.com --email-verified
docker exec mattermost mmctl --local team users add main zeke
docker exec mattermost mmctl --local channel users add main:datadog-alerts zeke

echo "\n  YOU CAN NOW LOG IN TO MATTERMOST AT $GP_URL:8065\n        username:  root\n        password:  mattermost\n"

docker exec mattermost mmctl auth login $GP_URL --name zeke --username zeke --password-file /credentials/zeke.txt
docker exec mattermost mmctl post create main:datadog-alerts --message "Hey @root, it's me, Zeke! I'm so glad you're finally here. Can you help us set up alerts for our new API? Let's move over to the [Datadog Alerts channel]($GP_URL:8065/main/channels/datadog-alerts)..."