# Openhim Console Dockerfile for latest changes
FROM node:14.17-alpine
RUN apk upgrade --update-cache --available
RUN apk add git

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY . .
# Install dependencies and build
RUN npm install
RUN npm install webpack-dev-server && npm install webpack webpack-cli --save-dev

RUN npm run build
RUN npm i -g http-server 

# Host and run server
CMD http-server ./dist -p 80