const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [ 
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: path.join(__dirname, 'src', 'index.html')
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  mode: 'development',
  devtool: 'source-map',
  entry: path.join(__dirname, 'src', 'app.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module:{
    rules: [
      //es6
      {
         test: /\.js/,
         exclude: /node_modules/,
         use: [
           {
             loader: 'babel-loader',
             options: { presets: ["env"] }
           }
         ]
      },
      //css
      {
        test: /\.css$/,
        
        use: [
            MiniCssExtractPlugin.loader, 'style-loader', 'css-loader'],
      },
      //scss
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {sourceMap: true}
          },
          {
              loader: 'css-loader',
              options: {sourceMap: true}
          },
          {
              loader: 'sass-loader',
              options: {sourceMap: true}
          },
        ]
      },
      //files
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      },
      { 
        test: /\.(eot|svg|ttf|woff2?|otf)$/,
        use: 'file-loader'
      },
    ]
  }
}