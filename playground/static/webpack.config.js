const webpack = require("webpack");
const config = {
  mode: "production",
  entry: {
    index: __dirname + "/scripts/index.js",
    gaussIndex: __dirname + "/scripts/gaussIndex.js",
    simpletodoIndex: __dirname + "/scripts/simpletodoIndex.js",
    urlIndex: __dirname + "/scripts/urlIndex.js",
    netflixIndex: __dirname + "/scripts/netflixIndex.js",
    spotifyIndex: __dirname + "/scripts/spotifyIndex.js",
  },
  devtool: "eval-cheap-module-source-map",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
    ],
  },
};
module.exports = config;
