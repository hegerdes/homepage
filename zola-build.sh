#!/bin/bash
set -e -o pipefail

BASE_DIR=$(realpath $(dirname "$0"))
bash $BASE_DIR/zola-install.sh
ZOLA_CONF="$BASE_DIR/config.toml"

mkdir -p $BASE_DIR/dist
PREVIEW_URL=${CF_PAGES_URL-$DEPLOY_URL}
PAGE_VERSION=${CF_PAGES_COMMIT_SHA-"unknown"}
HOMEPAGE_URL=${PREVIEW_URL-https://henrikgerdes.me}

# Check if the variable is unset or empty
if [ -z "$HOMEPAGE_URL" ]; then
    HOMEPAGE_URL=https://henrikgerdes.me
else
    HOMEPAGE_URL=$PREVIEW_URL
fi

# Use sed to replace version
echo "page_version=${PAGE_VERSION}"
sed -i "s/page_version.*/page_version = \"${PAGE_VERSION}\"/" "$ZOLA_CONF"

echo "Using url: ${HOMEPAGE_URL}"
zola --root $BASE_DIR build --base-url $HOMEPAGE_URL

echo "Build done!"
