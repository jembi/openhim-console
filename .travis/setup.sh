#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
    
# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_454006dcd4e6_key -iv $encrypted_454006dcd4e6_iv -in .travis/deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
mv deploy_key ~/.ssh/id_rsa


