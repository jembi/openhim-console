# Custom docker image for stateless containers (Google Cloud Run)
# Build Production Console in Node
FROM node:14.17-alpine as build

RUN apk add git

WORKDIR /app

COPY . .

RUN npm install

RUN npm run prepare

# Serve built project with nginx
FROM nginx:mainline-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist  ./

COPY infrastructure/google-cloud-run/start-nginx.sh /usr/bin/start-nginx.sh

RUN chmod +x /usr/bin/start-nginx.sh

ENTRYPOINT [ "start-nginx.sh" ]
