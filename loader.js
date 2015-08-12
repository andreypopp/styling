/**
 * @copyright 2015, Andrey Popp
 */

var path          = require('path');
var Module        = require('module');
var Styling       = require('./Styling');
var renderStyling = require('./renderStyling');

var NodeTemplatePlugin    = require('webpack/lib/node/NodeTemplatePlugin');
var NodeTargetPlugin      = require('webpack/lib/node/NodeTargetPlugin');
var LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
var SingleEntryPlugin     = require('webpack/lib/SingleEntryPlugin');
var LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');


module.exports = function styling(content) {
  this.cacheable();
  return content;
};

module.exports.pitch = function stylingPitch(request, precedingRequest) {
  if (this[__dirname] === false) {
    return;
  }
  var childFilename = "styling-output-filename";
  var outputOptions = {filename: childFilename};
  var childCompiler = this._compilation.createChildCompiler("styling-compiler", outputOptions);
  childCompiler.apply(new NodeTemplatePlugin(outputOptions));
  childCompiler.apply(new LibraryTemplatePlugin(null, "commonjs2"));
  childCompiler.apply(new NodeTargetPlugin());
  childCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request));
  childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }));

  var subCache = "subcache " + __dirname + " " + request;

  childCompiler.plugin("compilation", function(compilation) {
    if (compilation.cache) {
      if(!compilation.cache[subCache])
        compilation.cache[subCache] = {};
      compilation.cache = compilation.cache[subCache];
    }
  });

  // We set loaderContext[__dirname] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.
  childCompiler.plugin("this-compilation", function(compilation) {
    compilation.plugin("normal-module-loader", function(loaderContext) {
      loaderContext[__dirname] = false;
    });
  });

  var source;
  childCompiler.plugin("after-compile", function(compilation, callback) {
    source = compilation.assets[childFilename] && compilation.assets[childFilename].source();

    // Remove all chunk assets
    compilation.chunks.forEach(function(chunk) {
      chunk.files.forEach(function(file) {
        delete compilation.assets[file];
      });
    });

    callback();
  });

  var callback = this.async();

  childCompiler.runAsChild(function(err, entries, compilation) {
    if (err) {
      return callback(err);
    }
    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }
    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }
    compilation.fileDependencies.forEach(function(dep) {
      this.addDependency(dep);
    }, this);
    compilation.contextDependencies.forEach(function(dep) {
      this.addContextDependency(dep);
    }, this);
    try {
      var exports = this.exec(source, request);
      var stylesheet = [];
      for (var key in exports) {
        if (exports.hasOwnProperty(key)) {
          var styling = exports[key];
          if (Styling.is(styling)) {
            stylesheet = stylesheet.concat(renderStyling(key, styling));
          }
        }
      }
      var text = stylesheet.join('\n\n');
    } catch (e) {
      return callback(e);
    }
    if (text) {
      callback(null, text);
    } else {
      callback();
    }
  }.bind(this));
};
