'use strict';

var through = require('through2');
var nunjucks = require('nunjucks');

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }


    if (file.isStream()) {
      this.emit('error', new Error('nunjucksTransform', 'Streaming not supported'));
      return cb();
    }

    try {
      //options.name = typeof options.name === 'function' && options.name(file) || file.relative;
      nunjucks.configure(file.base);
      file.contents = new Buffer(nunjucks.renderString(file.contents.toString(), options));
    } catch (err) {
      this.emit('error', new Error('nunjucksTransform : error with ' + file.path, err));
    }

    this.push(file);
    cb();
  });
};
