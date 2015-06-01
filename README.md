# Project Ariana
Project ariana is a web-based image editing solution. We focus on a clean interface usable for both mouse and touchscreens. Our official website is fazeclan.xxx. 

## Project structure
`Structure cumming soon`

## Installation
ariana runs on a [Node.js](https://nodejs.org/) server. Installing ariana takes about 3 minutes.

#### Requirements
- Node.js
- git

#### Node.js
First of all, install [Node.js](https://nodejs.org/).

After installing Node.js enter the following in your terminal of choice:

```sh
$ git clone git@github.com:ArnoldSwaggernegger/ariana.git
$ cd ariana
```

Now that you have the repository cloned enter

```sh
$ npm install
$ bower install
$ grunt
```

- `npm install` installs all node modules defined in `package.json`
- `bower install' installs all dependencies defined in `bower.json` to a path specified in `.bowerrc`
- `grunt` tells grunt (build system) to build ariana.

#### Usage
To run ariana enter the following

```sh
$ node server.js build localhost:3000
```
