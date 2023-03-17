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

COPY --from=build /app/packages/legacy-app/dist  ./
COPY --from=build /app/packages/header-app/dist  ./
COPY --from=build /app/packages/sidebar-app/dist  ./
COPY --from=build /app/packages/root-config/dist  ./
