module.exports = function (factory, broccoli) {
  var CoffeeScriptPreprocessor = require('broccoli-coffee')(broccoli)
  var TemplatePreprocessor = require('broccoli-template')(broccoli)

  var appPkg = factory.makeTree()
    .map({
      'app': '/appkit',
    })
    .addTransformer(new broccoli.PreprocessorPipeline()
      .addPreprocessor(new TemplatePreprocessor({
        extensions: ['hbs', 'handlebars'],
        compileFunction: 'Ember.Handlebars.compile'
      }))
      .addPreprocessor(new CoffeeScriptPreprocessor({
        bare: true
      }))
    )

  var publicPkg = factory.makeTree()
    .map({
      // The public files get a completely separate namespace so we don't
      // accidentally match them with compiler glob patterns
      'public': '/appkit-public'
    })

  return [appPkg, publicPkg]
}
