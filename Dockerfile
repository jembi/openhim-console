# Build Production Console in Node
FROM node:16.19-alpine as build

RUN apk add git

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

# Serve built project with nginx
FROM nginx:mainline-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist  ./

COPY ./docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/bin/sh", "/usr/local/bin/docker-entrypoint.sh" ]
