/**
 * @copyright 2015, Andrey Popp
 */

var path                = require('path');
var Module              = require('module');
var Styling             = require('./Styling');
var renderStylingSheet  = require('./renderStylingSheet');

var NodeTemplatePlugin    = require('webpack/lib/node/NodeTemplatePlugin');
var NodeTargetPlugin      = require('webpack/lib/node/NodeTargetPlugin');
var LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
var SingleEntryPlugin     = require('webpack/lib/SingleEntryPlugin');
var LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');

var renderStylingSheetMod = require.resolve('./renderStylingSheet');

var extractTextWebpackPluginKey;
try {
  extractTextWebpackPluginKey = path.dirname(require.resolve('extract-text-webpack-plugin'));
} catch (error) {}

module.exports = function styling(content) {
  this.cacheable();
  if (this[__dirname] === false) {
    return '';
  } else if (typeof this[extractTextWebpackPluginKey] === 'function') {
    return '';
  } else if (this[extractTextWebpackPluginKey] === false) {
    var request = this.request.split('!').slice(this.loaderIndex + 1).join('!');
    produce(this, request, this.async());
  }  else {
    return '';
  }
};

module.exports.pitch = function stylingPitch(request, precedingRequest, data) {
  this.cacheable();
  if (this[__dirname] === false) {
    // if we already inside the loader
    return;
  } else if (extractTextWebpackPluginKey in this) {
    // if extract-text-webpack-plugin is active we do all work in a loader phase
    return;
  } else {
    produce(this, request, this.async());
  }
};

function produce(loader, request, callback) {
  var outputFilename = "styling-output-filename";
  var outputOptions = {filename: outputFilename};
  var childCompiler = getRootCompilation(loader).createChildCompiler("styling-compiler", outputOptions);
  childCompiler.apply(new NodeTemplatePlugin(outputOptions));
  childCompiler.apply(new LibraryTemplatePlugin(null, "commonjs2"));
  childCompiler.apply(new NodeTargetPlugin());
  childCompiler.apply(new SingleEntryPlugin(loader.context, "!!" + request));
  childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }));

  var subCache = "subcache " + __dirname + " " + request;

  childCompiler.plugin("compilation", function(compilation) {
    if (compilation.cache) {
      if(!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }
      compilation.cache = compilation.cache[subCache];
    }
  });

  // We set loaderContext[__dirname] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.
  childCompiler.plugin("this-compilation", function(compilation) {
    compilation.plugin("normal-module-loader", function(loaderContext) {
      loaderContext[__dirname] = false;
      if (extractTextWebpackPluginKey in loader) {
        loaderContext[extractTextWebpackPluginKey] = loader[extractTextWebpackPluginKey];
      }
    });
  });

  var source;
  childCompiler.plugin("after-compile", function(compilation, callback) {
    source = compilation.assets[outputFilename] && compilation.assets[outputFilename].source();

    // Remove all chunk assets
    compilation.chunks.forEach(function(chunk) {
      chunk.files.forEach(function(file) {
        delete compilation.assets[file];
      });
    });

    callback();
  });

  childCompiler.runAsChild(function(error, entries, compilation) {
    if (error) {
      return callback(error);
    }
    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0]);
    }
    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"));
    }
    compilation.fileDependencies.forEach(function(dep) {
      loader.addDependency(dep);
    });
    compilation.contextDependencies.forEach(function(dep) {
      loader.addContextDependency(dep);
    });
    try {
      var exports = loader.exec(source, request);
      var text = renderStylingSheet(exports);
    } catch (e) {
      return callback(e);
    }
    if (text) {
      callback(null, text);
    } else {
      callback();
    }
  });
}

function getRootCompilation(loader) {
  var compiler = loader._compiler;
  var compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}
