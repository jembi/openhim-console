export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);

cat config/default-env.json | envsubst $EXISTING_VARS | tee config/default.json

ls -l

nginx -g "daemon off;"
