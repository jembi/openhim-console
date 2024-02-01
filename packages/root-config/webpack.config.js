const {merge} = require('webpack-merge')
const singleSpaDefaults = require('webpack-config-single-spa-ts')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (webpackConfigEnv, argv) => {
  const orgName = 'jembi'
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: 'root-config',
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true
  })

  return merge(defaultConfig, {
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'src/index.ejs',
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName
        }
      })
    ]
  })
}
