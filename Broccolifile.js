module.exports = function (factory, broccoli) {
  var CoffeeScriptPreprocessor = require('broccoli-coffee')(broccoli)
  var TemplatePreprocessor = require('broccoli-template')(broccoli)
  var ES6ConcatenatorCompiler = require('broccoli-es6-concatenator')(broccoli)
  var StaticCompiler = require('broccoli-static-compiler')(broccoli)

  var appTree = factory.makeTree()
    .map('app', '/appkit')
    .addTransformer(new broccoli.PreprocessorPipeline()
      .addPreprocessor(new TemplatePreprocessor({
        extensions: ['hbs', 'handlebars'],
        compileFunction: 'Ember.Handlebars.compile'
      }))
      .addPreprocessor(new CoffeeScriptPreprocessor({
        bare: true
      }))
    )

  var publicTree = factory.makeTree()
    // The public files get a completely separate namespace so we don't
    // accidentally match them with compiler glob patterns
    .map('public', '/appkit-public')

  var builder = factory.makeBuilder()
    .addTrees([appTree, publicTree])
    .addBower()
    .addTransformer(new broccoli.CompilerCollection()
      .addCompiler(new ES6ConcatenatorCompiler({
        loaderFile: 'loader.js',
        ignoredModules: [
          'resolver'
        ],
        inputFiles: [
          'appkit/**/*.js'
        ],
        legacyFilesToAppend: [
          'jquery.js',
          'handlebars.js',
          'ember.js',
          'ember-data.js',
          'ember-resolver.js'
        ],
        outputFile: '/assets/app.js'
      }))
      .addCompiler(new StaticCompiler({
        srcDir: 'appkit-public',
        destDir: '/'
      }))
      .addCompiler(new StaticCompiler({
        srcDir: '/appkit',
        files: ['*.html'],
        destDir: '/'
      }))
    )

  return builder
}
