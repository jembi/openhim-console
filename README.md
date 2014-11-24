[![Build Status](https://travis-ci.org/jembi/openhim-console.svg?branch=master)](https://travis-ci.org/jembi/openhim-console)

OpenHIM Administration Console
==============================

This application provides a web application to configure and manage the [OpenHIM-core component](https://github.com/jembi/openhim-core-js). It provides the following features:

* Configure and manage OpenHIM channels
* View logged transactions
* Configure clients that can access particular routes
* Monitor the operations of the OpenHIM application

See the [development roadmap](https://github.com/jembi/openhim-console/wiki/OpenHIM-console-Development-Roadmap) for more details on what is to come!

Developer guide
---------------

Clone the repository and then run `npm install`

Install cli tools: `npm install -g grunt-cli grunt bower`

Install bower web components: `bower install`

To run the unit tests run `grunt test`

To start up a development instance of the webapp run `grunt serve`. The hostname and port can be changed in `Gruntfile.js`. The hostname can be changed to `0.0.0.0` in order to access the site from outside.

Note all changes will be automatically applied to the webapp and the page will be reloaded after each change. In addition JSHint will be run to provide information about errors or bad code style. The unit test will also be automatically be run if JSHint does not find any errors.

For unit testing [mocha](http://visionmedia.github.io/mocha/) using [chai.js](http://chaijs.com/api/bdd/) for assertions. We are using the BDD `should` style for chai as it more closely resembles the unit testing style that is being used for the [OpenHIM-core component](https://github.com/jembi/openhim-core-js)

This code was scaffolded using [Yeoman](http://yeoman.io/) and the [angular generator](https://github.com/yeoman/generator-angular). You can find more detials about the command available by looking at the docs of those tools.

Production Deployment
---------------------

Build the OpenHIM console using `grunt -v`.

This will compile the entire webapp into the `dist/` folder. Copy the contents of this folder into nginx or apache. Eg `/var/www/`

Configuring the console
-----------------------

To configure the consle to connect to a particular [OpenHIM-core](https://github.com/jembi/openhim-core-js) instance all you need to do is edit the configuration file found here: https://github.com/jembi/openhim-console/blob/master/app/config/default.json

Set the `PROTOCOL`, `HOST` and `PORT` constants to values that point to your OpenHIM server. Note: this OpenHIM server MUST be acessible to client computer that displays the OpenHIM console as a connection is made directly from the client to the OpenHIM server.

Using this config file you can also configure the title for the console as well as various footer information. 

Login Credentials
---------------
username: `root@openhim.org`
password: `openhim-password`
