# Openhim Console Dockerfile for latest changes
FROM ubuntu:20.04

WORKDIR /etc/

# Update apt-repo list and install prerequisits
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y bzip2
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Clone Openhim-console repo
RUN git clone https://github.com/jembi/openhim-console.git

WORKDIR /etc/openhim-console

# Install dependencies and build
RUN npm install webpack && npm install webpack-cli
RUN npm i
RUN npm run build
RUN npm i -g http-server 

# Host and run server
CMD http-server ./dist -p 80