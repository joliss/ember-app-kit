module.exports = function (factory, broccoli) {
  var CoffeeScriptFilter = require('broccoli-coffee')(broccoli)
  var TemplateFilter = require('broccoli-template')(broccoli)
  var ES6ConcatenatorCompiler = require('broccoli-es6-concatenator')(broccoli)
  var StaticCompiler = require('broccoli-static-compiler')(broccoli)

  var appTree = factory.makeTree()
    .map('app', '/appkit')
    .addTransformer(new TemplateFilter({
      extensions: ['hbs', 'handlebars'],
      compileFunction: 'Ember.Handlebars.compile'
    }))
    .addTransformer(new CoffeeScriptFilter({
      bare: true
    }))

  if (factory.env !== 'production') {
    appTree.map('tests', '/appkit/tests')
  }

  var publicTree = factory.makeTree()
    // The public files get a completely separate namespace so we don't
    // accidentally match them with compiler glob patterns
    .map('public', '/appkit-public')

  var outputTree = factory.makeTree()
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

  // if (factory.env === 'production') {
  //   outputTree.addTransformer(minifyAllTheThings)
  // }

  return outputTree
}
