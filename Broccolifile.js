module.exports = function (factory, broccoli) {
  var CoffeeScriptPreprocessor = require('broccoli-coffee')(broccoli)

  var appPkg = factory.makePackage()
    .map({
      'app': '/appkit',
    })
    .addTransformer(new broccoli.PreprocessorPipeline()
      .addPreprocessor(new broccoli.transformers.preprocessors.ES6TemplatePreprocessor({
        extensions: ['hbs', 'handlebars'],
        compileFunction: 'Ember.Handlebars.compile'
      }))
      .addPreprocessor(new CoffeeScriptPreprocessor({
        bare: true
      }))
    )

  var publicPkg = factory.makePackage()
    .map({
      // The public files get a completely separate namespace so we don't
      // accidentally match them with compiler glob patterns
      'public': '/appkit-public'
    })

  return [appPkg, publicPkg]
}
