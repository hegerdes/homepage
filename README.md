# HomePage

[![Netlify Status](https://api.netlify.com/api/v1/badges/b0d8c38e-c68e-4f8f-81a2-5104ba2ba919/deploy-status)](https://app.netlify.com/sites/henrikgerdes/deploys) [![Deploy Site](https://github.com/hegerdes/HomePage/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/hegerdes/HomePage/actions/workflows/build.yml)

Check out the page: [https://henrikgerdes.me](https://henrikgerdes.me)

This is my homepage. Build with [zola](https://www.getzola.org/) and primarily deployed on Cloudflare. This project will generate static pages based on the content and templates.  
In addition to that, it is a fill headless content management system (HCMS) for blog posts. Write your posts in Markdown, and generate a new version of your page.

## Build Setup

```bash,linenos
# install dependencies
$ bash zola-install.sh

# serve with hot reload at localhost:1111
$ zola serve

# generate static project
$ zola build
```
