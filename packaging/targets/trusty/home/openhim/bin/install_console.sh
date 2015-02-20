#!/bin/bash


USERNAME=openhim
HOME=/home/$USERNAME
export NVM_DIR=$HOME/.nvm 
NPM=$NVM_DIR/current/bin/npm
CURL=/usr/bin/curl
CONSOLEDIR=$HOME/openhim-console
BOWER=$CONSOLEDIR/node_modules/bower/bin/bower
GRUNT=$CONSOLEDIR/node_modules/grunt-cli/bin/grunt


. $HOME/.nvm/nvm.sh

cd $HOME

nvm use 0.12

cd $CONSOLEDIR

$NPM install
$NPM install  grunt-cli grunt bower

$BOWER install
$GRUNT build

