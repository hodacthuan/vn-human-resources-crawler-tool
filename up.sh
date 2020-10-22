#!/bin/bash
CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${CWD}
./install-tools.sh

export DEPLOY_DIR=$CWD
export SERVICE_NAME=crawl
export DOCKER_REGISTRY=tintechrepos

export DEPLOY_ENV=${1}

ENVS=(local prod)
if [[ ! " ${ENVS[@]} " =~ " ${DEPLOY_ENV} " ]]; then
    echo "Only accept ENV: ${ENVS[@]}"
    exit 0
fi

# SERVER: set SERVER_COMMAND to run in crawl server
if [ "$DEPLOY_ENV" == "prod" ]; 
then
    export SERVER_COMMAND='npm install && NODE_ENV=production node app.js'
    export WWW_COMMAND='npm install && REACT_APP_NOT_SECRET_CODE=prod npm start'
else 
    export SERVER_COMMAND='npm install && NODE_ENV=local nodemon app.js'
    export WWW_COMMAND='npm install && REACT_APP_NOT_SECRET_CODE=local npm start'
fi

docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d

exit 0