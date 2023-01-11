#!/bin/bash

echo "Initializing Mattermost for demo..."

sleep 10

docker exec mattermost mmctl --local user create --username root --password mattermost --email example@test.com --system-admin --email-verified
docker exec mattermost mmctl --local team create --display-name "Plantalytics, Inc." --name main
docker exec mattermost mmctl --local channel create --team main --display-name "Datadog Alerts" --name datadog-alerts
docker exec mattermost mmctl --local team users add main:datadog-alerts root
docker exec mattermost mmctl --local channel users add main:datadog-alerts root

echo "\n  YOU CAN NOW LOG IN TO MATTERMOST:\n        username:  root\n        password:  mattermost\n"