# OpenHIM Administration Console

[![Build Status](https://travis-ci.org/jembi/openhim-console.svg?branch=master)](https://travis-ci.org/jembi/openhim-console) [![OpenHIM Core](https://img.shields.io/badge/openhim--core-3.4.x-brightgreen.svg)](http://openhim.readthedocs.org/en/v3.4.2/user-guide/versioning.html)

This application provides a web application to configure and manage the [OpenHIM-core component](https://github.com/jembi/openhim-core-js). It provides the following features:

* Configure and manage OpenHIM channels
* View logged transactions
* Configure clients that can access particular routes
* Monitor the operations of the OpenHIM application
* Managing the security infrastructure
* Importing and exporting OpenHIM server configuration

See the [development road-map](http://openhim.org/docs/introduction/roadmap) for more details on what is to come!

See documentation and tutorials at [openhim.org](http://openhim.org).

---

## Getting started with the OpenHIM Console

### Developer guide

> First ensure that you have the OpenHIM-core server up and running. See [details on how to get the OpenHIM-core setup](https://github.com/jembi/openhim-core-js/blob/master/README.md)

Clone the repository and then run

```sh
npm install
```

To start up a development instance of the webapp run

```sh
npm start
```

For file changes to apply run `npm build` before starting the server.

To run tests:

```sh
npm test
```

---

### Docker

To spin up a full OpenHIM environment, navigate to the `infrastructure` folder and execute: `docker-compose up`

The config for the console is controlled via the `default.json` file in the config directory. The file is copied from your local repo on start up.

To edit the file:

```sh
#docker exec -it {console-container} bash
docker exec -it openhim-console bash
apt-get update && apt-get install vim -y
vi /usr/share/nginx/html/config/default.json
```
Or the sed command can be used

```sh
 sed -i -e  "s/localhost/<yourDomainHere>/g" /usr/share/nginx/html/config/default.json

```

Your file should look something like this:

``` json
{
  "protocol": "https", // Change the protocol to 'http' when the OpenHIM core API protocol is 'http'. The default OpenHIM core API protocol is 'https'
  "host": "localhost", // change this to the hostname for your OpenHIM-core server (This hostname _MUST_ be publicly accessible)
  "port": 8080, // change this to the API port of the OpenHIM-core server, default is 8080
  "title": "OpenHIM Admin Console", // You may change this to customize the title of the OpenHIM-console instance
  "footerTitle": "OpenHIM Administration Console", // You may change this to customize the footer of the OpenHIM-console instance
  "footerPoweredBy": "<a href='http://openhim.org/' target='_blank'>Powered by OpenHIM</a>",
  "loginBanner": "", // add text here that you want to appear on the login screen, if any.
  "showLoginForm": true, // this could be disabled in favor of a SSO using keycloak
  "mediatorLastHeartbeatWarningSeconds": 60, // Mediator heartbeat check intervals to issue a warning status
  "mediatorLastHeartbeatDangerSeconds": 120, // Mediator heartbeat check intervals to issue a danger status
  "ssoEnabled": false, // enable SSO with Keycloak
  "keyCloakUrl": "http://localhost:9088", // Keycloak URL
  "keyCloakRealm": "platform-realm", // Keycloak Realm name
  "keyCloakClientId": "openhim-oauth" // Keycloak client ID
}
```

Now, navigate to your web server and you should see the OpenHIM-console load (eg. `http://localhost:9000`) and login. The default username and password are:

* username: `root@openhim.org`
* password: `openhim-password`

You will be prompted to change this.

> **Note:** You will have problems logging in if your OpenHIM server is still setup to use a self-signed certificate (the default). To get around this you can use the following workaround (the proper way to solve this is to upload a proper certificate into the OpenHIM-core):

Visit the following link: `https://localhost:8080/authenticate/root@openhim.org` in Chrome. Make sure you are visiting this link from the system that is running the OpenHIM-core. Otherwise, replace `localhost` and `8080` with the appropriate OpenHIM-core server hostname and API port. You should see a message saying "**Your connection is not private**". Click "Advanced" and then click "Proceed". Once you have done this, you should see some JSON, you can ignore this and close the page. Ths will ignore the fact that the certificate is self-signed. Now, you should be able to go back to the Console login page and login. This problem will occur every now and then until you load a properly signed certificate into the OpenHIM-core server.

---

## Developer guide

Clone the repository and then run

```sh
npm install
```

To start up a development instance of the webapp run

```sh
npm run start:dev
```

To start up a production instance run

```sh
npm start
```

For file changes to apply run `npm build` before starting the server.

To run tests:

```sh
npm test
```

---

## Deployments

All commits to the `master` branch will automatically trigger a build of the latest changes into a docker image on dockerhub.

---

## Creating CentOS RPM package

The build process for the RPM package is based off [this blog](https://github.com/bbc/speculate/wiki/Packaging-a-Node.js-project-as-an-RPM-for-CentOS-7). The reason for using vagrant instead of docker is so that we can test the RPM package by running it as a service using SystemCtl - similar to how it will likely be used in a production environment. SystemCtl is not available out the box in docker containers.

Refer to [this blog](https://developers.redhat.com/blog/2014/05/05/running-systemd-within-docker-container/) for a more detailed description of a possible work-around. This is not recommended since it is a hack. This is where vagrant comes in since it sets up an isolated VM.

1. Setup environment

    Navigate to the infrastructure folder: `infrastructure/centos`

    Provision VM and automatically build RPM package:

    ```bash
    vagrant up
    ```

    or without automatic provisioning (useful if you prefer manual control of the process):

    ```bash
    vagrant up --no-provision
    ```

1. [Optional] The Vagrant file provisions the VM with the latest source code from master and attempts to compile the RPM package for you. However in the event an error occurs, or if you prefer to have manual control over the process, then you'll need to do the following:

    * Remote into the VM: `vagrant ssh`
    * Download or sync all source code into VM.
    * Ensure all dependencies are installed.

    ```bash
    npm i && npm i speculate
    ```

    * Run speculate to generate the SPEC files needed to build the RPM package.

    ```bash
    npm run spec
    ```

    * Ensure the directory with the source code is linked to the rpmbuild directory - the     folder RPMBUILD will use.

    ```bash
    ln -s ~/openhim-console ~/rpmbuild
    ```

    * Build RPM package.

    ```bash
    rpmbuild -bb ~/rpmbuild/SPECS/openhim-console.spec
    ```

1. Install & Test package

    ```bash
    sudo yum install -y ~/rpmbuild/RPMS/x86_64/openhim-console-{current_version}.x86_64.rpm
    sudo systemctl start openhim-console
    curl http://localhost:9000
    ```

    Note: In order for openhim-console to run successfully, you'll need to point it to a    valid instance of Openhim-core or install it locally:

1. How to check the logs?

    ```bash
    sudo systemctl status openhim-console
    sudo tail -f -n 100 /var/log/messages
    ```

1. If everything checks out then extract the RPM package by leaving the VM.

    Install Vagrant scp [plugin](https://github.com/invernizzi/vagrant-scp):

    ```bash
    vagrant plugin install vagrant-scp
    ```

    Then copy the file from the VM:

    ```bash
    vagrant scp default:/home/vagrant/rpmbuild/RPMS/x86_64/{filename}.rpm .
    ```

---

## Contributing

You may view/add issues here: <https://github.com/jembi/openhim-console/issues>

To contribute code, please fork the repository and submit a pull request. The maintainers will review the code and merge it in if all is well.
