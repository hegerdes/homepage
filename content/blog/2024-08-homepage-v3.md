+++
title = "New Website - Abandon JavaScript Frameworks"
description = "I finaly managed to rewrite my website and to turn my back on javascript frontend frameworks like react, angular and vue. Let me tell you why and what I ended up using instead."
date = '2024-09-01'

[taxonomies]
categories=["it"]
tags = ['Website', 'Dev', 'Vue', 'JavaScript', 'TypeScript', 'NodeJS']

[extra]
pic = "/img/blog/website_v3.jpeg"
+++
# New Website - Abandoning JavaScript frameworks

This is the third generation of my website. I went from raw handwritten HTML to falling into the JavaScript frontend framework pit, back to raw HTML with a little templating. Let me tell you about this journey and my thoughts.  
Be aware that I'm not a web-developer and I will never be one!

## My First website - Getting things out there:
I was still in university and wanted to get some practical experience. My university had zero lectures about web-development, but I thought having my own site would be cool.  
I also have never shipped any software yet, so I had no clue how to put something out there for others to use. So I found a nice template I liked and customized it to my likings. HTML is not that complicated, and I didn't need any JavaScript for this simple static site. So building the skeleton was quite easy, unitl I wanted to style it with CSS.  
I have worked with various programming languages, also low level languages like C/C++ but I've never had to fight this much to get things working. I get the idea of classes but to this day I never fully understood the global scope of styles, overrides nor am I even close to now even a subset of all the CSS properties and transformers.  

Now I had something usable, I needed to get it out there. I bought my first domain from the small German hoster IONOS - which was exiting back then. Now I was looking for a free hosting solution and eventually found [netlify](https://www.netlify.com/). Now I needed to put put domain and hosting together. DNS at IONOS sucks (like almost everything) so I transferred the DNS zone to netlify and started battling a little with TLS.

Yet, eventually I got to a state that was fine for me. Still the site had issues.  
Whenever I wanted to add a project I copied a bunch of HTML and added the new text. The header/footer was manually copied to every page and the CSS was looking okay, but was actually a mess. But it worked for back then.  
Check out [v1](https://homepage-v1.henrikgerdes.me)

## Getting into professionalism - Frameworks
I was still in university but was working almost full-time at a local software company. My task there was to modernize and automate a lot of the deployment stack. I was given a lot of trust and I learned a lot. Things that work and things that don't work. Occassionally I helped out on one of there products which was a NodeJS backend and a VUE.JS frontend which used nuxed to facilliate server-side-rendering (SSR).  
Everyone on YouTube and Medium was talking about frontend Frameworks for the web. Everything seemed to be build with Angular, React or VUE. So I belived this is the way to build the web. I fully bought into it.

So I started to rebuild my site with nuxt. Being able to reuse components for header and footer was great, but the whole creation process seemed a bit *off*. Passing object variables to a VUE component as a string is strange.  
The complexity added up. I wanted to publish blog posts written in markdown - no problem with nuxt-content. To style it use bootstrap, vuetify and more. Want to add approximation for reading time? Yet another package. Which you have to integrate with webpack. I did't want to learn webpack, I wanted to create a webpage with a blog. It all seems unnecessary complicated.  
Having to keep in mind which part of the app was rendered server-side and which client side added additional cognitive load.

But since everyone is using the technology, it seems like this is the way.

Yet, eventually I got to a state that was fine for me. Still the site had Issues.  
Load times where a not good, he style was inconsistent, code-blocks looked awful and I never good it working that the site remembered if had dark-mode activated on refreshes. But it was good enough. I used that site for almost three years. It worked for writing articles and I prioritized other things.

## A fresh start - escaping the JS dept
The site was automatically build from the main branch via netlify. Dependabot was setup to pack my packages. But the JavaScript world is fast moving and a lot of people dont bother with backwards compatibly. With time nuxt3 was released, but nothing worked with it. The site was using vue2, bootstrab4 and webpack4. Everything got deprecated and Dependabot kept reminding me of updates and vulnabilities. The site was slow and vulnerabilities!

To that day I carefully select my JS packages and avoid dependencies when ever possible because I think the JS ecosystem is a **mess**.  

I was looking for alternatives quite some time. I did't want to go down the JS framework road again, mainly because I did't need most of their functions. I wanted a static site generator. I looked into hugo which is great but I did't find nice themes and found the themes creation process to much for my task.  
Check out [v2](https://homepage-v2.henrikgerdes.me)

#### Zola to the rescue!
Eventually I found [zola](https://www.getzola.org/) by browsing on the webpage of a colleague.  
It looked great, entirely content orientated:

 * You can have themes, but you don't need to
 * First party support for markdown rendering
 * Single small binary
 * Build & refresh is fast as heck
 * Support for SASS

So I started porting over my first page as a proof of concept. And it worked great!  
Exactly the feature-set I wanted and nothing more. Templating is done with [terra](https://keats.github.io/tera/) a python jinja2 like templating language which I was quite familiar with thanks to my cuntless hours in ansible. I had not a single issue with it. At least not with zola. CSS on the other hand reminded me why I will never be a web-developer. Getting things look nice on every device is hard - even with bootstrap.

If I could with for one thing regarding zola it would be better control on how to pass classed into rendered content and more built-in code syntax highlight themes.


## The current state
I moved my back on JavaScript frontend frameworks - at least for static content.  
The whole site is now build with zola and adding new stuff is super easy. I also moved to site to cloudflare, better metrics, performance and I will not be billed 50k if I get DDOSed.

I'm quite happy with it right now. I still need do some fights. But for my own sanity and well bing I'm shipping early and often to keep seeing progress.

Things to do:
 * Fix sidebar layout on blog page
 * Add optional Live Demo button on some project
 * Dark Theme
 * Write more

Some stats between my site:
|            | RAW   | Nuxt  | Zola  |
|------------|-------|-------|-------|
| JS         | 140KB | 4.2MB | 156KB |
| HTML       | 544KB | 13MB  | 1.4MB |
| Build Time | 0s    | 14s   | 2.2s  |

🧾📖 NOTE: You might want to check out [v1](https://homepage-v1.henrikgerdes.me), [v2](https://homepage-v2.henrikgerdes.me) and [v3](https://henrikgerdes.me) of my site.

