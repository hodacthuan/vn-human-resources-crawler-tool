#!/bin/bash
CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${CWD}

export DEPLOY_ENV=${1}

ENVS=(server www)
if [[ ! " ${ENVS[@]} " =~ " ${DEPLOY_ENV} " ]]; then
    echo "Only accept ENV: ${ENVS[@]}"
    exit 0
fi

docker-compose -f docker-compose.yml exec ${1} bash

exit 0