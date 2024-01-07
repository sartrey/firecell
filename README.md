# firecell

This is a web app powered by `epiijs`.

## Project

### About Server

`src/server` is a simple server powered by `epiijs`.

Web server is the workload running at server hosts, such as AWS EC2 or Alibaba Cloud ECS. 

Generally modern web server is only suitable for providing API services.

### About Client

`src/client` is a simple React + LESS client powered by `epiijs`.

Users will access and run your client app in browser.

You can build client into static content and deploy product into cloud storage service, such as AWS S3 or Alibaba Cloud OSS.

Also you can use your own server instead of CDN to deliver static content, but maybe you will pay more cost about stability and performance.
