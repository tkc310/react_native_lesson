// @see https://zenn.dev/nabettu/articles/7da3c52d993756a19594
// created by `expo customize:web`

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // tsconfigを参照
  config.resolve.plugins.push(
    new TsconfigPathsPlugin({
      configFile: "tsconfig.json"
    })
  );

  return config;
};
