module.exports = function (factory, broccoli) {
  var CoffeeScriptFilter = require('broccoli-coffee')(broccoli)
  var TemplateFilter = require('broccoli-template')(broccoli)
  var UglifyJSFilter = require('broccoli-uglify-js')(broccoli)
  var ES6ConcatenatorCompiler = require('broccoli-es6-concatenator')(broccoli)
  var StaticCompiler = require('broccoli-static-compiler')(broccoli)

  // Construct the tree for our application files; this tree
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

  var inputTrees = new broccoli.InputTreeCollection()
    .addTrees([appTree, publicTree])
    .addBower()

  var applicationJS = new ES6ConcatenatorCompiler({
    inputTrees: inputTrees,
    loaderFile: 'loader.js',
    ignoredModules: [
      'resolver'
    ],
    mainFiles: [
      'appkit/**/*.js'
    ],
    legacyFilesToAppend: [
      'jquery.js',
      'handlebars.js',
      'ember.js',
      'ember-data.js',
      'ember-resolver.js'
    ],
    outputFile: '/assets/app.js',
    wrapInEval: factory.env !== 'production'
  })

  if (factory.env === 'production') {
    applicationJS.addTransformer(new UglifyJSFilter({
      // mangle: false,
      // compress: false
    }))
  }

  var applicationCSS = new SassCompiler({
    inputTrees: inputTrees,
    mainFile: '/appkit/application.css',
    outputFile: '/assets/application.css'
  })

  var publicTree = factory.makeTree()
    .map('public', '/')

  var moreStaticFiles = new StaticCompiler({
    inputTrees: inputTrees,
    srcDir: '/appkit',
    files: ['*.html'],
    destDir: '/'
  })

  return [applicationJS, applicationCSS, publicTree, moreStaticFiles]
}
