# Openhim Console Dockerfile for latest changes
FROM node:14.17-alpine as build
RUN apk add git

RUN mkdir -p /app
WORKDIR /app

COPY . .

# Install dependencies and build
RUN npm install

FROM nginx:mainline-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist  /usr/share/nginx/html