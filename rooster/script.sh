#!/bin/bash

team_name="main"
team_display_name="Mattermost"
channel_name="example"
channel_display_name="Example"
user_name="root"
user_password="$(openssl rand -base64 14)"

print_usage() {
  printf "\nrooster :: user roster generator for Mattermost\n\n Valid arguments:\n\n  -t <name>   Team name              (default: main)\n  -d <name>   Team display name      (default: Mattermost)\n  -c <name>   Channel name           (default: example)\n  -i <name>   Channel display name   (default: Example)\n  -u <name>   User name              (default: root)\n  -p <pass>   User password          (default is generated and printed)\n\n"
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

echo -e "Setting up Mattermost with ...\n Team name: $team_name\n Team display name: $team_display_name\n Channel name: $channel_name\n Channel display name: $channel_display_name"

echo "Initializing Mattermost for demo..."
sleep 35

docker exec mattermost mmctl --local team create --display-name $team_display_name --name $team_name
docker exec mattermost mmctl --local channel create --team $team_name --display-name $channel_display_name --name $channel_name

echo -e "Initializing your admin account ...\n\n User name: $user_name\n User password: $user_password\n"
docker exec mattermost mmctl --local user create --username $user_name --password $user_password --email $user_name@$team_name.com --system-admin --email-verified
docker exec mattermost mmctl --local team users add $team_name $user_name
docker exec mattermost mmctl --local channel users add $team_name:$channel_name $user_name

export MM_URL="$(gp url 8065)"
echo -e "\n\n  YOU CAN NOW LOG IN TO MATTERMOST AT $MM_URL\n        username:  $user_name\n        password:  $user_password\n"

cd data/users

for user in * ; do
    pw="$(openssl rand -base64 14)"
    echo $pw > ./$user/password.txt
    
    echo "Initializing demo user $user with password $pw..."
    docker exec mattermost mmctl --local user create --username $user --password $pw --email $user@$team_name.com --system-admin --email-verified
    docker exec mattermost mmctl --local team users add $team_name $user
    docker exec mattermost mmctl --local channel users add $team_name:$channel_name $user

    docker exec mattermost mmctl auth login http://localhost:8065 --name $user --username $user --password-file /rooster/data/users/$user/password.txt
    IFS=: read -r token name <<< "$(docker exec mattermost mmctl token generate $user demo)"
    echo $token > ./$user/token.txt
done
