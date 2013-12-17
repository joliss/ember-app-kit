module.exports = function (broccoli) {
  var mainPackages = broccoli.readers.Package.fromDirectory('.') // improve API
  var bowerPackages = broccoli.readers.bowerPackages('vendor')

  var packages = mainPackages.concat(bowerPackages)

  var builder = new broccoli.Builder({
      tmpDir: 'tmp'
    })
    .setReader(new broccoli.readers.PackageReader(packages))
    .addTransformer(new broccoli.CompilerCollection()
      .addCompiler(new broccoli.transformers.compilers.ES6ConcatenatorCompiler({
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
      .addCompiler(new broccoli.transformers.compilers.StaticFileCompiler({
        srcDir: 'appkit-public',
        destDir: '/'
      }))
      .addCompiler(new broccoli.transformers.compilers.StaticFileCompiler({
        srcDir: 'appkit',
        files: ['*.html'],
        destDir: '/'
      }))
    )

  return builder
}
