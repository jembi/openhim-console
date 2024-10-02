#!/usr/bin/env bash

# Select version of import-maps-mfe to use when building. "main" refers to the main Git branch, which means you'll automatically use the latest code. It's recommended to lock to a specific version of import-maps-mfe to avoid unintended upgrades. To do that, use "v1.0.0" (replace with the version you want to use)
export DOCKERFILE_VERSION=main

# Push vars. Each deployed environment has its own docker tag
export ENVIRONMENT_NAME=v2.0.0-alpha.2
export DOCKER_ORG_NAME=jembi
PROJECT_UNIQUE_HASH_VERSION=$(git rev-parse HEAD)
export PROJECT_UNIQUE_HASH_VERSION
# Get the script's directory
script_dir=$(dirname "$0")

# Go up two levels to find the "packages" directory
packages_dir="$script_dir/../.."

echo "$packages_dir"

# Create a JSON file to store package information
packages_json="$script_dir/importmap.json"
echo '{"imports": {}}' >"$packages_json"
# Iterate over packages
cd ../../ || exit

jq '. += {"environment": "production"}'  packages/legacy-app/app/config/default.json > packages/legacy-app/app/config/default.json.tmp && mv packages/legacy-app/app/config/default.json.tmp packages/legacy-app/app/config/default.json

rm packages/root-config/.env.local

cat packages/openhim-core-api/.env
cat packages/root-config/.env
npm install
npm run build:prod
for package in "packages"/*; do
    if [ -d "$package" ]; then
        (
            echo "package: $package"
            # Go into the package directory in a subshell

            cd $(pwd)/$package || exit

            # Copy the "dist" directory to the target directory
            package_name=$(basename "$package")
            package_name=$(cat package.json | jq -r .name)
            mkdir -p "../../packaging/import-maps-server/builds/$package_name/dist/"
            cp -r dist/ "../../packaging/import-maps-server/builds/$package_name/"
            js_file=$(find "../../packaging/import-maps-server/builds/$package_name/dist" -maxdepth 1 -type f -name "*.js" -print -quit)
            file_name=$(basename "$js_file" .js)
            echo "Extracted name: $file_name, $(pwd)"
            #Add package to the JSON file
            cd "../../packaging/import-maps-server/" || exit
            
            jq --arg module_url "./libs/$package_name/dist/$file_name.js" ".imports += {\"$package_name\": \$module_url}" "$packages_json" >"$packages_json.tmp" && mv "$packages_json.tmp" "$packages_json"
        )
    fi
done
cd  packaging/import-maps-server/ || exit

docker build -f Dockerfile-mf --progress=plain --no-cache . -t $DOCKER_ORG_NAME/openhim-console:$ENVIRONMENT_NAME --build-arg WORK_DIR=$(pwd) --build-arg sourceDir=$(pwd)/packaging --build-arg libVersion=$PROJECT_UNIQUE_HASH_VERSION --build-arg baseImage=singlespa/import-maps-mfe-server

echo "IMAGE_ID=$DOCKER_ORG_NAME/openhim-console:$ENVIRONMENT_NAME" >>"$GITHUB_ENV"

echo "image id is $GITHUB_ENV"
