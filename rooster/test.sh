#!/bin/bash

team_name="main"
team_display_name="Mattermost"
channel_name="example"
channel_display_name="Example"
user_name="root"
user_password="$(openssl rand -base64 14)"

print_usage() {
  printf " -t     Team name\n -d     Team display name\n -c     Channel name\n -i     Channel display name\n -u     User name\n -p     User password\n"
}

while getopts 'tdciup:v' flag; do
  case "${flag}" in
    t) team_name="${OPTARG}" ;;
    d) team_display_name="${OPTARG}" ;;
    c) channel_name="${OPTARG}" ;;
    i) channel_display_name="${OPTARG}" ;;
    u) user_name="${OPTARG}" ;;
    p) user_password="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done

echo "Initializing Mattermost for demo..."
sleep 25

echo "Setting up Mattermost with ...\n Team name: $team_name\n Team display name: $team_display_name\n Channel name: $channel_name\n Channel display name: $channel_display_name"
docker exec mattermost mmctl --local team create --display-name $team_display_name --name $team_name
docker exec mattermost mmctl --local channel create --team $team_name --display-name $channel_display_name --name $channel_name

echo "Initializing admin account ...\n User name: $user_name\n User password: $user_password\n"
docker exec mattermost mmctl --local user create --username $user_name --password $user_password --email $user_name@test.com --system-admin --email-verified
docker exec mattermost mmctl --local team users add $team_name $user_name

cd ./rooster/users

for user in * ; do
    pw="$(openssl rand -base64 14)"
    echo "Initializing demo user $user with password $pw..."
    docker exec mattermost mmctl --local user create --username $user --password $pw --email $user@test.com --system-admin --email-verified
    docker exec mattermost mmctl --local team users add $team_name $user_name
    docker exec mattermost mmctl --local channel users add $team_name:$channel_name $user
done
