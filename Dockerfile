FROM node:boron

RUN npm install -g grunt-cli bower

ADD package.json /src/openhim-console/
WORKDIR /src/openhim-console/
RUN npm install

ADD . /src/openhim-console/

RUN bower install --allow-root
CMD grunt serve
