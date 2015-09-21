var path = require("path");
// webpack.config.js
module.exports = {
  entry: {
    main:     "./js/app-landing.js",
    need:     "./js/app-need.js",
    access:   "./js/app-access.js",
    district: "./js/app-districts.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {      
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
