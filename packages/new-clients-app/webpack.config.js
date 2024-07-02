const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "jembi",
    projectName: "clients-app",
    webpackConfigEnv,
    argv,
    externals: [/^@jembi\/.+/]
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [new webpack.EnvironmentPlugin(), new DotenvPlugin()]
  });
};
