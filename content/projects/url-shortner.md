+++
title = "URL Shortner | JavaScript"
description = "NodeJS & Vue based"
[taxonomies]
categories=[]
tags = []

[extra]
pic = "/img/lazyurl.png"
pic_alt="Screenshot of webpage with text input form - like google search"
link_source="https://github.com/hegerdes/Lazy-URL"
link_demo="https://lazyurl.henrikgerdes.me"
+++

These Amazon product URLs are too long?  
Than use a URL shortner. Just the BASE_URL/SHORT and you can save a lot of typing. This NodeJS App exposes a REST-API. A simple POST to '/url' will generate a new Database entry with your URL and either a custom or random generated short. If the short gets requested you simply get redirected.  
The API is consumed by a simple Vue fronted.
