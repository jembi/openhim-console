#!/bin/bash

RELEASE_VERSION=$1
if [ -z ${RELEASE_VERSION} ]
then
  echo "You need so specify the release version you wish to build: e.g './build-docker-centos-rpm.sh 1.14.3'"
  echo "https://github.com/jembi/openhim-console/releases"
  exit
fi

# Set docker container name to build RPM package
containerName=openhim-console-centos-rpm

# Define the CentOS version to build in the docker container
docker pull centos:7

docker run -t -d --rm --name $containerName centos:7 /bin/bash

echo "Update packages: "
docker exec -it $containerName sh -c "yum -y update"

echo "Install needed packages: "
docker exec -it $containerName sh -c "yum install -y git rpm-build redhat-rpm-config gcc-c++ make"

echo "Install needed packages: "
docker exec -it $containerName sh -c "curl --silent --location https://rpm.nodesource.com/setup_14.x | bash -"

echo "Install needed packages: "
docker exec -it $containerName sh -c "yum install -y nodejs"

echo "Fetch release version from Github"
docker exec -it $containerName sh -c "mkdir /openhim-console && curl -sL 'https://github.com/jembi/openhim-console/archive/v$RELEASE_VERSION.tar.gz' | tar --strip-components=1 -zxv -C /openhim-console"

echo "npm install && npm install speculate && npm run build"
docker exec -it $containerName sh -c "cd /openhim-console && npm install && npm install speculate && npm run build:prod && npm run spec"

echo "Symlink the openhim-console folder with the rpmbuild folder"
docker exec -it $containerName sh -c "ln -s /openhim-console ~/rpmbuild"

# if the Release Version incluldes a dash, apply workaround for rpmbuild to not break on dashes
if [[ "${RELEASE_VERSION}" == *"-"* ]]
then
  RELEASE_VERSION_TEMP=${RELEASE_VERSION//-/_}
  echo "Release Version contains unsupported dash (-) for building rpm package. Replacing with underscore (_) temporarily"
  docker exec -it $containerName sh -c "sed -i 's/$RELEASE_VERSION/$RELEASE_VERSION_TEMP/g' ~/rpmbuild/SPECS/openhim-console.spec"
fi

echo "Build RPM package from spec"
docker exec -it $containerName sh -c "rpmbuild -bb ~/rpmbuild/SPECS/openhim-console.spec"

# if the Release Version incluldes a dash, apply workaround for rpmbuild to not break on dashes
if [[ "${RELEASE_VERSION}" == *"-"* ]]
then
  RELEASE_VERSION_TEMP=${RELEASE_VERSION//-/_}
  echo "Rename the generated RPM package to the expected release version name (revert the changes from underscore to dashes)"
  docker exec -it $containerName sh -c "mv /openhim-console/RPMS/x86_64/openhim-console-$RELEASE_VERSION_TEMP-1.x86_64.rpm /openhim-console/RPMS/x86_64/openhim-console-$RELEASE_VERSION-1.x86_64.rpm"
fi

echo "Extract RPM package from container"
docker cp $containerName:/openhim-console/RPMS/x86_64/openhim-console-$RELEASE_VERSION-1.x86_64.rpm .

# Stop the container to ensure it gets cleaned up after running to commands
echo "Removing the container"
docker stop $containerName