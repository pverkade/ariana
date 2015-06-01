# ariana
Project ariana - a webbased photo manipulator

## Userguide

#### Node.js
First of all, install [Node.js](https://nodejs.org/).

After installing Node.js enter the following in your terminal of choice:

```sh
$ git clone git@github.com:ArnoldSwaggernegger/ariana.git
$ cd ariana
```

Now that you have the repository cloned enter

```sh
$ npm -g install grunt-cli karma bower
```

npm is a package manager shipped with node. This command will install grunt (build system), karma (test system) and bower (additional package manager). After succesfully installing enter

```sh
$ npm install
$ bower install
$ grunt watch
```

- `npm install` installs all node modules defined in `package.json`
- `bower install' installs all dependencies defined in `bower.json` to a path specified in `.bowerrc`
- `grunt watch` tell grunt (build system) to build and watch for further changes.

#### Usage
To run ariana enter the following

```sh
$ node server.js build localhost:3000
```
