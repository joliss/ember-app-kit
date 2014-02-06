module.exports = function (factory, broccoli) {
  var filterCoffeeScript = require('broccoli-coffee')(broccoli)
  var filterTemplates = require('broccoli-template')(broccoli)
  var uglifyJavaScript = require('broccoli-uglify-js')(broccoli)
  var compileES6 = require('broccoli-es6-concatenator')(broccoli)
  var pickFiles = require('broccoli-static-compiler')(broccoli)

  var appTree = factory.makeTree()
    .map('app', '/appkit')

  if (factory.env !== 'production') {
    appTree.map('tests', '/appkit/tests')
  }

  appTree = filterTemplates(appTree, {
    extensions: ['hbs', 'handlebars'],
    compileFunction: 'Ember.Handlebars.compile'
  })
  appTree = filterCoffeeScript(appTree, {
    bare: true
  })

  var inputTree = new broccoli.MergedTree(
    [appTree]
    .concat(broccoli.bowerTrees())
  )

  var indexHtml = pickFiles(inputTree, {
    srcDir: '/appkit',
    files: ['*.html'],
    destDir: '/'
  })

  applicationJs = compileES6(inputTree, {
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
  }).setWrapInEval(factory.env !== 'production')

  if (factory.env === 'production') {
    applicationJs = uglifyJavaScript(applicationJs, {
      // mangle: false,
      // compress: false
    })
  }

  var publicTree = factory.makeTree()
    .map('public', '/')

  return [applicationJs, publicTree, indexHtml]
}
