OpenHIM Administration Console
==============================

This application provides a web application to configure and manage the [OpenHIM-core component](https://github.com/jembi/openhim-core-js). It provides the following features:

* Configure and manage OpenHIM channels
* View logged transactions
* Configure applications that can access particular routes
* Monitor the operations of the OpenHIM application

:warning:  **The OpenHIM Administration Console is currently in early active development and is not yet ready for production use.**

Developer guide
---------------

Clone the repository and then run `npm install`

To run the unit tests run `grunt test`

To start up a development instance of the webapp run `grunt serve`.

Note all changes will be automatically applied to the webapp and the page will be reloaded after each change. In addition JSHint will be run to provide information about errors or bad code style. The unit test will also be automatically be run if JSHint does not find any errors.

For unit testing [mocha](http://visionmedia.github.io/mocha/) using [chai.js](http://chaijs.com/api/bdd/) for assertions. We are using the BDD `should` style for chai as it more closely resembles the unit testing style that is being used for the [OpenHIM-core component](https://github.com/jembi/openhim-core-js)

This code was scaffolded using [Yeoman](http://yeoman.io/) and the [angular generator](https://github.com/yeoman/generator-angular). You can find more detials about the command available by looking at the docs of those tools.