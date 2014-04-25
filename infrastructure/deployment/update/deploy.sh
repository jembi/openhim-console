#!/bin/bash

SOURCEDIR="<%= @source_dir %>"

cd $SOURCEDIR;
git pull && puppet apply infrastructure/deployment/env/openhim-console.pp
