#!/bin/bash

if ([ "$TRAVIS_BRANCH" == "master" ]) && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    curl -H 'Content-Type: application/json' --data '{"source_type": "Branch", "source_name": "console"}' -X POST https://registry.hub.docker.com/u/jembi/openhim-console/trigger/f4e50fb6-7d96-4668-84bb-b456ba4fab6e/
else
    echo "Docker image will only be built for commits to master"
fi
