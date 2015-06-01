# ariana
Project ariana - is a web-based image editing solution. We focus on a clean interface usable for both mouse and touchscreens. Our official website is fazeclan.xxx.

## Index
- [Project structure](https://github.com/ArnoldSwaggernegger/ariana#project-structure)
- [Installation](https://github.com/ArnoldSwaggernegger/ariana#installation)
  - [Requirements](https://github.com/ArnoldSwaggernegger/ariana#requirements)
  - [Node.js](https://github.com/ArnoldSwaggernegger/ariana#nodejs)
  - [Usage](https://github.com/ArnoldSwaggernegger/ariana#usage)
- [Development](https://github.com/ArnoldSwaggernegger/ariana#development)
  - [git workflow](https://github.com/ArnoldSwaggernegger/ariana#git-workflow)
  - [HTML styleguide](https://github.com/ArnoldSwaggernegger/ariana#html-styleguide)
  - [CSS/SASS styleguide](https://github.com/ArnoldSwaggernegger/ariana#csssass-styleguide)
  - [JS styleguide](https://github.com/ArnoldSwaggernegger/ariana#js-styleguide)

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

## Development
ariana is based on [Angular.js](https://angularjs.org/) and [WebGL](https://www.chromeexperiments.com/webgl).
Please follow the following styleguides to ensure development of ariana goes smoothly.

#### git workflow
ariana uses git as version control system. When developing ariana refer to the [issue tracker](https://github.com/ArnoldSwaggernegger/ariana/issues) to find userstories.
When using ariana and git:
- **never** push directly to master
- work on a new branch for every **feature**
  - when you are done with your feature send in a pull request to master
  - make sure the pull request can automatically merge
  - give a meaningful description for your pull request
- when fixing an issue refer to the `#issue_number` in your commit (example: `fixes #23 - height of header is now correct`).
- always provide a meaningful description with your commit (even when fixing issues).

#### HTML styleguide
- use double quotation marks `<class="classname">`, not `<class='classname'>`
- no spaces between types and attributes `<class="classname">`, not `<class = "classname">`
- keep tags lowercase `<div>`, not `<DIV>`
- use classes to style elements `<class="classname">`
- please refrain from using inline styles `<style="don't do this">`
- indentation is not necessary
- when you need to use indentation, use 4 spaces
- place every element on their own row (not necessary if row is very short)
```
<p>
text
</p>
```
- refrain from using a `<div>` when a `<span>` is also possible

#### CSS/SASS styleguide
- indentation is 4 spaces
- give meaningful names to classes
- please follow the following class and element layout
```
element { 
    property: value;
    property: value;
    
    .nested_class {
        property: value;
    }
    
    element, .class {
        property: value;
    }
}
```
- Note that SASS allows for nested class defenitions. However, don't overdo nesting
- stylesheets are split up into modules (widgets, headers, etc.). All variables will be combined into one file. A main file will import every other file.
- when adding a new style, always check if the same defenition already excists in another file.
- refer to the [SASS documentation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) for detials on SASS

#### JS styleguide
- indentation is 4 spaces
- please write `//comment` for single row comments
- please write
```
/*
 * comments
 * are
 * great
 */
```
  for multirow comments
- don't overdo comments, only write them if necessary to understand a section
- begin each file with a header
```
/*
 * Project ariana
 * File: filename
 * Author: your name
 * Date: date created
 * Description: small description of file
 */
```
- use
```
if (condition) {
    statements;
}
```
