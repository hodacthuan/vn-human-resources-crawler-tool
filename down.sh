#!/bin/bash
CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${CWD}

docker-compose -f docker-compose.yml down

exit 0