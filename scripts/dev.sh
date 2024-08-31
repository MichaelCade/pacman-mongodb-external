#!/usr/bin/env bash

# User defined variables:
MONGO_AUTH_PWD='Passw0rd999!'
MONGO_AUTH_USER='mongoadmin'
MONGO_SERVICE_HOST='192.168.169.101,192.168.169.102,192.168.169.103'
MONGO_REPLICA_SET='rs0'

# DO NOT EDIT ANYTHING PAST THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING

# Enable tracing:
set -x
# Enable exit on first error:
set -o errtrace
# Enable error on unset variables:
set -o nounset
# Variable definition
LOCAL_WORKDIR=$(pwd)
DOCKER_NETWORK_NAME='pacman-dev'
PACMAN_CONTAINER_NAME='pacman'
PACMAN_CONTAINER_IMAGE='pacman'
PACMAN_WORKDIR='/usr/src/app'
PACMAN_LOCAL_PORT='8080'
PACMAN_CONTAINER_PORT='8080'

# Define a cleanup function
cleanup() {
    docker stop ${PACMAN_CONTAINER_NAME}
    docker network rm ${DOCKER_NETWORK_NAME}
}
# Register our cleanup function as a trap
trap cleanup EXIT

# Create a temporary docker network
docker network create --driver bridge ${DOCKER_NETWORK_NAME}

# Run the Pac-Man container
docker run --rm -it --name ${PACMAN_CONTAINER_NAME} \
    --network ${DOCKER_NETWORK_NAME} \
    -e MONGO_SERVICE_HOST=${MONGO_SERVICE_HOST} \
    -e MONGO_AUTH_USER=${MONGO_AUTH_USER} \
    -e MONGO_AUTH_PWD=${MONGO_AUTH_PWD} \
    -e MONGO_REPLICA_SET=${MONGO_REPLICA_SET} \
    -v ${LOCAL_WORKDIR}:${PACMAN_WORKDIR} \
    -p ${PACMAN_LOCAL_PORT}:${PACMAN_CONTAINER_PORT} \
    --entrypoint ash \
    ${PACMAN_CONTAINER_IMAGE}