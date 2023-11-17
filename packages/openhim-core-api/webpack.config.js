const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");

const webpack = require('webpack')
const DotenvPlugin = require('dotenv-webpack')

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "jembi",
    projectName: "openhim-core-api",
    webpackConfigEnv,
    argv
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [new webpack.EnvironmentPlugin(), new DotenvPlugin()]
  });
};
