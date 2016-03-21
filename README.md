# Angular 1.5 starter kit.

### Package

- Uses AngularJS, Gulp, Jade, Sass, browserSync. 

### Setup
- `$ git clone https://github.com/andrew92a/angular-1.5-starter-kit`
- `$ npm install`
- `$ npm install -g gulp`
- `$ gem install sass`
- `$ cp config-example.json config.json`
- `$ gulp`

### Directory structure

* data - contains yml files that will be compiled to json, they are used to simulate the response of fake request.
* images - contains projects images
* scripts - all *.js source files, angular bootstrap file.
    * modules - angular modules directory
        * main - example angular module
            * contents - example angular component
* styles - all *.scss source files
* views
    * _components - contains jade mixin, static modules.
        * sidebar - example static jade mixin
    * _shared - base jade templates

