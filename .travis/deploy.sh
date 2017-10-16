#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

# Set variables
REMOTE_TARGET="test"
if [[ $1 ]]; then
    REMOTE_TARGET=$1 # target environment config: [test/staging]
fi
REMOTE_URL=138.68.140.146
NOW=`date +%Y%m%d%H%M%S`
NODE_ENV="production"

# Copy new Dockerfile to remote server
ssh -oStrictHostKeyChecking=no travis_deploy@188.166.147.164 "test -e ~/Dockerfile"
if [ $? -eq 0 ]; then
    # remove dockerfile if it exists to ensure using the latest version
    echo "File exists"
    ssh -oStrictHostKeyChecking=no travis_deploy@188.166.147.164 "rm ~/Dockerfile"
else
    echo "File is missing"
fi
scp -oStrictHostKeyChecking=no .travis/Dockerfile travis_deploy@$REMOTE_URL:~

# Copy config for target container with updated ports and mongo urls
ssh -oStrictHostKeyChecking=no travis_deploy@188.166.147.164 "test -e ~/$REMOTE_TARGET.json"
if [ $? -eq 0 ]; then
    # remove dockerfile if it exists to ensure using the latest version
    echo "File exists"
    ssh -oStrictHostKeyChecking=no travis_deploy@188.166.147.164 "rm ~/$REMOTE_TARGET.json"
else
    echo "File is missing"
fi
scp -oStrictHostKeyChecking=no .travis/$REMOTE_TARGET.json travis_deploy@$REMOTE_URL:~

# Log into remote server to execute these docker commands on the deployment server
ssh -oStrictHostKeyChecking=no travis_deploy@$REMOTE_URL <<EOF
    sudo su

    # backup & shutown current containers
    docker ps
    docker stop openhim-console-$REMOTE_TARGET
    docker rename openhim-console-$REMOTE_TARGET openhim-console-$REMOTE_TARGET-backup-$NOW

    # Build docker image with latest changes
    docker build --build-arg branch=$REMOTE_TARGET -t $REMOTE_TARGET/openhim-console .
    rm Dockerfile # no-longer needed

    # install new container
    docker run -itd \
        -e NODE_ENV="$NODE_ENV" \
        -v /home/travis_deploy/$REMOTE_TARGET.json:/usr/share/nginx/html/config/default.json \
        --network=openhim \
        --name=openhim-console-$REMOTE_TARGET \
        $REMOTE_TARGET/openhim-console

    # exit ssh & sudo sessions
    echo "Docker image built and deployed..."
    exit
    exit
EOF

