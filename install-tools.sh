#!/bin/bash

echo '>> INSTALL TOOLS NEEDED'
git config --global core.filemode false

DOCKER=$(which docker)

if [[ $DOCKER == '' ]]; then 
    echo 'Install docker ...'

    sudo apt-get dist-upgrade
    uname

    sudo apt-get remove docker docker-engine docker.io containerd runc -y

    sudo apt-get update

    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg-agent \
        software-properties-common

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

    sudo apt-key fingerprint 0EBFCD88

    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

    # Docker Engine 

    sudo apt-get update

    sudo apt install -y docker-ce

    sudo apt install -y docker-ce docker-ce-cli containerd.io

    apt-cache madison docker-ce

    # very important to make sure docker work properly
    sudo chmod 666 /var/run/docker.sock

    sudo systemctl enable docker

    # sudo systemctl status docker
    
fi;

DOCKER_COMPOSE=$(which docker-compose)

if [[ $DOCKER_COMPOSE == '' ]]; then 
    echo 'Install docker compose ...'

    # can use this link instead:  https://github.com/hodacthuan/docker-compose/raw/master/docker-compose
    sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    sudo chmod +x /usr/local/bin/docker-compose

    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    #should be version 1.23.1
    docker-compose version

fi;

# install awscli
aws --version >/dev/null 2>&1
[[ $? != 0 ]] && echo 'Install aws-cli' && sudo apt-get install awscli -y

# install redis-cli
redis-cli --version >/dev/null 2>&1
[[ $? != 0 ]] && echo 'Install redis-cli' && sudo apt-get install redis-tools -y

# change hostname and REBOOT
SERVER_NAME=$1
if [[ $SERVER_NAME != '' ]]; then
  echo "Change hostname to ${SERVER_NAME}"
  sudo hostnamectl set-hostname ${SERVER_NAME}
  sudo reboot
fi

# Change mode doker sock: Sometime the server restart accidentially
sudo chmod 666 /var/run/docker.sock