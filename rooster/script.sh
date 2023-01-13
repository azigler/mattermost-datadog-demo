#!/bin/bash

echo "Initializing Mattermost for demo..."

team_name="Mattermost"
channel_name="Example"
user_name="root"
user_password="$(openssl rand -base64 14)"

print_usage() {
  printf "-d     Team display name\n-c     Channel display name\n-u     User name\n-p     User password"
}

while getopts 'tcup:v' flag; do
  case "${flag}" in
    t) team_name="${OPTARG}" ;;
    c) channel_name="${OPTARG}" ;;
    u) user_name="${OPTARG}" ;;
    p) user_password="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done

sleep 25

for d in ./*/ ; do
    echo "$d"
done

docker exec mattermost mmctl --local user create --username root --password mattermost --email example@test.com --system-admin --email-verified
docker exec mattermost mmctl --local team create --display-name "Plantalytics, Inc." --name main
docker exec mattermost mmctl --local channel create --team main --display-name "Datadog Alerts" --name datadog-alerts
docker exec mattermost mmctl --local team users add main root
docker exec mattermost mmctl --local channel users add main:datadog-alerts root

export MM_URL="$(gp url 8065)"

for filename in ./*.txt; do
    for ((i=0; i<=3; i++)); do
        ./MyProgram.exe "$filename" "Logs/$(basename "$filename" .txt)_Log$i.txt"
    done
done

docker exec mattermost mmctl --local user create --username zeke --password zekemattermost --email zeke@test.com --email-verified
docker exec mattermost mmctl --local team users add main zeke
docker exec mattermost mmctl --local channel users add main:datadog-alerts zeke

echo "\n  YOU CAN NOW LOG IN TO MATTERMOST AT $MM_URL\n        username:  root\n        password:  mattermost\n"

docker exec mattermost mmctl auth login $MM_URL --name zeke --username zeke --password-file /credentials/zeke.txt

