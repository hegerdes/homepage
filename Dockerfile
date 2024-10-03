FROM --platform=linux/amd64 debian:bookworm-slim AS build

COPY zola-install.sh /app/zola-install.sh
RUN apt-get -qq update \
    && apt-get install --yes -qq curl tar gzip \
    && bash /app/zola-install.sh

WORKDIR /app
COPY . /app
RUN zola build

FROM nginx:stable-alpine
ARG COMMIT_HASH="none"
ARG COMMIT_TAG="none"
LABEL COMMIT_TAG=$COMMIT_TAG
LABEL COMMIT_HASH=$COMMIT_HASH

COPY --chown=nginx:nginx --from=build /app/dist/ /usr/share/nginx/html/
# COPY default.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://localhost || exit 1
ENTRYPOINT [ "nginx" , "-g", "daemon off;"]
