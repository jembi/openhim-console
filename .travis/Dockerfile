# Openhim Console Dockerfile for latest changes #ubuntu:16.04
FROM nginx
ARG branch

WORKDIR /etc/

# Update apt-repo list and install prerequisits
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y bzip2
RUN apt-get install -y curl gnupg gnupg2 gnupg1
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN node -v
RUN npm -v

# Clone Openhim-console repo
RUN git clone https://github.com/jembi/openhim-console.git

WORKDIR /etc/openhim-console

RUN git checkout -b $branch origin/$branch
RUN git branch

# Install dependencies and build
RUN npm i
RUN npm run build

# Deploy static web files to nginx root folder
RUN cp -r dist/* /usr/share/nginx/html

