FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app
RUN npm run generate


FROM nginx:stable-alpine

ARG COMMIT_HASH="none"
ARG COMMIT_TAG="none"
LABEL COMMIT_TAG=$COMMIT_TAG
LABEL COMMIT_HASH=$COMMIT_HASH

COPY --chown=nginx:nginx --from=build  /app/dist /usr/share/nginx/html

ENTRYPOINT [ "nginx" , "-g", "daemon off;"]