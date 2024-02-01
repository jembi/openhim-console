ARG baseImage=singlespa/import-maps-mfe-server

FROM ${baseImage}

ARG sourceDir=dist
ARG virtualDir=libs
ARG libName=unknown
ARG libVersion=unknown
ARG libMainFile=unknown.js
ARG nginxDir=/usr/share/nginx/html
ARG publicOrigin=https://jembi.org
ARG importMapFilename=app.importmap

COPY importmap.json ${nginxDir}/${importMapFilename}
COPY builds/@jembi/root-config/dist/index.html ${nginxDir}/index.html
COPY builds/@jembi/legacy-console/dist/config ${nginxDir}/config
COPY images ${nginxDir}/images
COPY builds/@jembi/legacy-console/dist/styles.css ${nginxDir}/
COPY builds/@jembi/legacy-console/dist/favicon.ico ${nginxDir}/
COPY builds/@jembi/legacy-console/dist/fonts ${nginxDir}/fonts
COPY ${sourceDir}/ ${nginxDir}/${virtualDir}/"@jembi"


# Update import map with the module URL
#RUN moduleName=${libName}; moduleUrl=${publicOrigin}/${virtualDir}/${libName}/${libVersion}/${libMainFile}; echo $(cat ${nginxDir}/${importMapFilename} | jq --arg moduleName "$moduleName" --arg moduleUrl "$moduleUrl" '.imports[$moduleName] = $moduleUrl') > ${nginxDir}/main.importmap

# Add "package as trailing slash" entry in import map
# https://github.com/WICG/import-maps#packages-via-trailing-slashes
#RUN moduleName=${libName}/; moduleUrl=${publicOrigin}/${virtualDir}/${libName}/${libVersion}/; echo $(cat ${nginxDir}/${importMapFilename} | jq --arg moduleName "$moduleName" --arg moduleUrl "$moduleUrl" '.imports[$moduleName] = $moduleUrl') > ${nginxDir}/main.importmap