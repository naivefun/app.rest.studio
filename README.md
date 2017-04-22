# app.rest.studio

[![Build Status](https://travis-ci.org/naivefun/app.rest.studio.svg?branch=develop)](https://travis-ci.org/naivefun/app.rest.studio)

## vs Postman?

Unlike `Postman` which is a chrome app (in chrome), `Rest Studio` is a web application running as a website. However RS still requires Chrome Extension for cross domain requests.

`Postman` use self-hosted server for data sync but `Rest Studio` makes use of cloud storage providers for data sync. Supports for Dropbox, Google Drive and Baidu Cloud Disk is planned and Dropbox implementation is under actively development.

With cloud storage it is up to you to manage the access. For example you can create a project directory which is shared across your team, `Rest Studio` is not aware of that but only push and pull data out of the box.

`Postman` supports collection level sync but `Rest Studio` will support both single-request or collection sync.

`Postman` has more features like test scripts and documentation, if that is what you need for now, go for `Postman` or other options. `Rest Studio` may add those features with more time but it is not guaranteed.

## Roadmap

### For Sure
- collections
- pages
- environment

### Maybe
- Test scripts
- Swagger documentation

## Important Information

It is in early stage and not fully functional. Some configuration is hard coded for now.

This project will need chrome + extension to fix CORS issue. (if the server side is configured to accept request from app.rest.studio)

The target is to be able to deploy on your own machine easily. Stay tuned. :)
