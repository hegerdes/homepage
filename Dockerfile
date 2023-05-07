FROM node:18-alpine as build

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider
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
HEALTHCHECK --interval=5m --timeout=3s \
    CMD curl --fail http://localhost || exit 1

ARG COMMIT_HASH="none"
ARG COMMIT_TAG="none"
ENV COMMIT_HASH=$COMMIT_HASH
ENV COMMIT_TAG=$COMMIT_TAG
LABEL commit-hash=$COMMIT_HASH
LABEL commit-tag=$COMMIT_TAG

ENTRYPOINT [ "nginx" , "-g", "daemon off;"]
