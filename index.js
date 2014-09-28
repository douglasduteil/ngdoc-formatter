'use strict';

var fs = require('vinyl-fs');
var path = require('path');
var through = require('through2');
var marked = require('marked');
var nunjucksTransform = require('./tasks/nunjucksTransform.js');
var _ = require('lodash');


module.exports = ngdocFormatter;

ngdocFormatter.defaultMarkdownTemplate = path.resolve(__dirname, './defaultTemplates/ngdoc.md.nunjucks');
ngdocFormatter.defaultNgdocSectionsOrder = ['function', 'directive', 'object', 'type', 'service', 'provider', 'filter'];

function ngdocFormatter(options) {

  options = _.defaults(options || {}, {
    template: ngdocFormatter.defaultMarkdownTemplate,
    ngdocSectionsOrder: ngdocFormatter.defaultNgdocSectionsOrder,
    hLevel: 1
  });

  return through.obj(function (file, enc, callback) {

    var data = JSON.parse(file.contents.toString());

    // Precompile the params descriptions
    _(data).pluck('params').flatten().compact().each(function (param) {
      param.description = param.description && marked(param.description);
    });

    var sortedByNgdoc = _.groupBy(data, 'ngdoc');

    // intersection sorted as the default array order.
    var ngdocSectionOrder = _.intersection(options.ngdocSectionsOrder, Object.keys(sortedByNgdoc));

    fs.src(options.template)
      .pipe(nunjucksTransform({
        sectionOrder: ngdocSectionOrder,
        sections: sortedByNgdoc,
        hLevel : options.hLevel
      }))
      .pipe(through.obj(function (mdFile) {
        callback(null, mdFile);
      }));

  });
}

