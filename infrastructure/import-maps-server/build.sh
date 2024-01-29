#!/usr/bin/env bash

# Select version of import-maps-mfe to use when building. "main" refers to the main Git branch, which means you'll automatically use the latest code. It's recommended to lock to a specific version of import-maps-mfe to avoid unintended upgrades. To do that, use "v1.0.0" (replace with the version you want to use)
export DOCKERFILE_VERSION=main

# Push vars. Each deployed environment has its own docker tag
export ENVIRONMENT_NAME=prod
export BASE_URL="http://localhost:7401"
export DOCKER_ORG_NAME=jembi
PROJECT_UNIQUE_HASH_VERSION=$(git rev-parse HEAD)
export PROJECT_UNIQUE_HASH_VERSION

# Get the script's directory
script_dir=$(dirname "$0")

# Go up two levels to find the "packages" directory
packages_dir="$script_dir/../.."

echo "$packages_dir"

rm -rf builds/*

# Create a JSON file to store package information
packages_json="$script_dir/importmap.json"
echo '{"imports": {}}' >"$packages_json"
# Iterate over packages
for package in "$packages_dir/packages"/*; do
    if [ -d "$package" ]; then
        (
            # echo "package: $package"
            # Go into the package directory in a subshell
            cd "$package" || exit

            # Copy the "dist" directory to the target directory
            package_name=$(basename "$package")
            package_name=$(cat package.json | jq -r .name)

            echo "$packages_dir/infrastructure/import-maps-server/$package_name"
            mkdir -p "$packages_dir/infrastructure/import-maps-server/builds/$package_name/dist/"
            cp -r dist/ "$packages_dir/infrastructure/import-maps-server/builds/$package_name/"
            js_file=$(find "$packages_dir/infrastructure/import-maps-server/builds/$package_name/dist" -maxdepth 1 -type f -name "*.js" -print -quit)
            file_name=$(basename "$js_file" .js)

            echo "Extracted name: $file_name"
            #Add package to the JSON file

            cd "$packages_dir/infrastructure/import-maps-server/" || exit
            jq --arg module_url "$BASE_URL/libs/$package_name/dist/$file_name.js" ".imports += {\"$package_name\": \$module_url}" "$packages_json" >"$packages_json.tmp" && mv "$packages_json.tmp" "$packages_json"
            # jq --arg module_url "http://localhost:7401/libs/@jembi/$package_name/dist/" ".imports += {\"@jembi/$package_name/\": \$module_url}" "$packages_json" >>"$packages_json.tmp" && mv "$packages_json.tmp" "$packages_json"

        )
    fi
done

# echo "Building $package_name" $PWD
docker build -f Dockerfile . -t $DOCKER_ORG_NAME/openhim-console-mf:$ENVIRONMENT_NAME --build-arg sourceDir=builds/@jembi --build-arg libVersion=$PROJECT_UNIQUE_HASH_VERSION --build-arg baseImage=$DOCKER_ORG_NAME/import-maps-mfe-server

cat "$packages_json"
