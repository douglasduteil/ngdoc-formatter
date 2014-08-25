# ngdoc-formatter

> Populate a template with ngdoc parsed data. (using [ngdoc-parser](https://github.com/douglasduteil/ngdoc-parser))

Get your ngdoc steady and ready to go!


## Install

```sh
$ npm install --save-dev ngdoc-formatter
```


## Usage

```js
var fs = require('vinyl-fs');
var path = require('path');
var through = require('through2');

var ngdocFormatter = require('ngdoc-formatter');

fs.src('./compiled-doc/*.json')
  .pipe(ngdocFormatter())
  .pipe(through.obj(function(file, e, callback){
    file.path = path.join(file.base, 'api.md');
    callback(null, file);
  }))
  .pipe(fs.dest('./doc'));
```

## API

### ngdocFormatter(options)

#### options

##### template

Type: `string`  
Default: `ngdocFormatter.defaultMarkdownTemplate`

The [nunjucks](http://mozilla.github.io/nunjucks) template to process with the ngdoc data.

###### Built-in templates

- `ngdocFormatter.defaultMarkdownTemplate` (see [defaultTemplates/ngdoc.md.nunjucks](https://github.com/douglasduteil/ngdoc-formatter/blob/master/defaultTemplates/ngdoc.md.nunjucks))

##### ngdocSectionsOrder

Type: `string[]`  
Default: `changed.defaultNgdocSectionsOrder`


Describe the order in which each grouped `@ngdoc` type will be describe in the final template.  
The default order is `changed.defaultNgdocSectionsOrder` :

    1.  function
    2.  directive
    3.  object
    4.  type
    5.  service
    6.  provider
    7.  filter


## Play well with [ngdoc-parser](https://github.com/douglasduteil/ngdoc-parser)

```js

var fs = require('vinyl-fs');
var path = require('path');
var through = require('through2');

var ngdocParser = require('ngdoc-parser');
var ngdocFormatter = require('ngdoc-formatter');

fs.src('./src/*.js')
  .pipe(ngdocParser())
  .pipe(ngdocFormatter())
  .pipe(through.obj(function(file, e, callback){
    file.path = path.join(file.base, 'api.md');
    callback(null, file);
  }))
  .pipe(fs.dest('./out'));
```

## License

    Copyright © 2014 Douglas Duteil <douglasduteil@gmail.com>
    This work is free. You can redistribute it and/or modify it under the
    terms of the Do What The Fuck You Want To Public License, Version 2,
    as published by Sam Hocevar. See the LICENCE file for more details.

