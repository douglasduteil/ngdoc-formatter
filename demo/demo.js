'use strict';

var fs = require('vinyl-fs');
var path = require('path');
var through = require('through2');

var ngdocFormatter = require('../index');

fs.src('./demo/*.json')
  .pipe(ngdocFormatter({
    template: ngdocFormatter.defaultMarkdownTemplate
  }))
  .pipe(through.obj(function (file, e, callback) {
    var outFilePath = path.join(file.base, 'api.md');
    console.log('Generating Markdown file : ', outFilePath);
    file.path = outFilePath;
    callback(null, file);
  }))
  .pipe(fs.dest('./out'));
