#!/usr/bin/env bash
export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);

cat config/default-env.json | envsubst $EXISTING_VARS | tee config/default.json

nginx -g 'daemon off;'
