const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./public/jsFunctions/dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};