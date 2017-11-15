[![Build Status](https://travis-ci.org/jembi/openhim-console.svg?branch=master)](https://travis-ci.org/jembi/openhim-console) [![OpenHIM Core](https://img.shields.io/badge/openhim--core-3.4.x-brightgreen.svg)](http://openhim.readthedocs.org/en/v3.4.2/user-guide/versioning.html)

OpenHIM Administration Console
==============================

This application provides a web application to configure and manage the [OpenHIM-core component](https://github.com/jembi/openhim-core-js). It provides the following features:

* Configure and manage OpenHIM channels
* View logged transactions
* Configure clients that can access particular routes
* Monitor the operations of the OpenHIM application
* Managing the security infrastructure
* Importing and exporting OpenHIM server configuration

See the [development roadmap](https://github.com/jembi/openhim-console/wiki/OpenHIM-console-Development-Roadmap) for more details on what is to come!

See [the documentation](https://github.com/jembi/openhim-console/wiki) for more details to get started.

For additional information and tutorials see [openhim.org](http://openhim.org).

Getting started with the OpenHIM Console
----------------------------------------

First ensure that you have the OpenHIM-core server up and running. The console communicates with the OpenHIM-core via its API to pull and display data. See [details on how to get the OpenHIM-core setup](https://github.com/jembi/openhim-core-js/blob/master/README.md).

Next, you need to pull down the latest release of the web app and deploy it to a web server (replace the X's in the below command to the latest release):

```
wget https://github.com/jembi/openhim-console/releases/download/vX.X.X/openhim-console-vX.X.X.tar.gz
tar -vxzf openhim-console-vX.X.X.tar.gz --directory /var/www/
```

Next, and this step is _vital_, you need to configure the console to point to your OpenHIM-core server. Locate `config/default.js` in the folder you extracted the OpenHIM console to and edit it as follows:

```
{
  "protocol": "https",
  "host": "localhost", // change this to the hostname for your OpenHIM-core server (This hostname _MUST_ be publically accessible)
  "port": 8080, // change this to the API port of the OpenHIM-core server, default is 8080
  "title": "OpenHIM Admin Console", // You may change this to customise the title of the OpenHIM-console instance
  "footerTitle": "OpenHIM Administration Console", // You may change this to customise the footer of the OpenHIM-console instance
  "footerPoweredBy": "<a href='http://openhim.org/' target='_blank'>Powered by OpenHIM</a>",
  "loginBanner": "" // add text here that you want to appear on the login screen, if any.
}
```

Now, navigate to your web server and you should see the OpenHIM-console load (eg. `http://localhost/`) and login. The default username and password are:

* username: `root@openhim.org`
* password: `openhim-password`

You will be prompted to change this.

**Note:** You will have problems logging in if your OpenHIM server is still setup to use a self-signed certificate (the default). To get around this you can use the following workaround (the proper way to solve this is to upload a proper certificate into the OpenHIM-core):

Visit the following link: `https://localhost:8080/authenticate/root@openhim.org` in Chrome. Make sure you are visiting this link from the system that is running the OpenHIM-core. Otherwise, replace `localhost` and `8080` with the appropriate OpenHIM-core server hostname and API port. You should see a message saying "Your connection is not private". Click "Advanced" and then click "Proceed". Once you have done this, you should see some JSON, you can ignore this and close the page. Ths will ignore the fact that the certificate is self-signed. Now, you should be able to go back to the Console login page and login. This problem will occur every now and then until you load a properly signed certificate into the OpenHIM-core server.

Developer guide
---------------
To run this version of the console (v1.12.0-rc.1) requires a minimum version of [OpenHIM-Core v4.0.0-rc.5](https://github.com/jembi/openhim-core-js/releases/tag/v4.0.0-rc.5)

Clone the repository and then run `npm install`

Install cli tools: `npm install -g grunt-cli grunt bower`

Install bower web components: `bower install`

To run the unit tests run `grunt test`

To start up a development instance of the webapp run `grunt serve`. The hostname and port can be changed in `Gruntfile.js`. The hostname can be changed to `0.0.0.0` in order to access the site from outside.

Note all changes will be automatically applied to the webapp and the page will be reloaded after each change. In addition JSHint will be run to provide information about errors or bad code style. The unit tests will also be automatically be run if JSHint does not find any errors.

For unit testing we are using [mocha](http://mochajs.org/) with [chai.js](http://chaijs.com/api/bdd/) for assertions. We are using the BDD `should` style for chai as it more closely resembles the unit testing style that is being used for the [OpenHIM-core component](https://github.com/jembi/openhim-core-js)

This code was scaffolded using [Yeoman](http://yeoman.io/) and the [angular generator](https://github.com/yeoman/generator-angular). You can find more detials about the command available by looking at the docs of those tools.


Deployments
------------

All commits to the `master` branch will automatically trigger a build of the latest changes into a docker image on dockerhub. 

All commits directly to `staging` or `test` will automatically build and deploy a docker image to the test and staging servers respectively.


Contributing
------------

You may view/add issues here: https://github.com/jembi/openhim-console/issues

To contibute code, please fork the repository and submit a pull request. The maintainers will review the code and merge it in if all is well.
