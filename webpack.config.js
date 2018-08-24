const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  watch: true,
  entry: ['./src/js/main.js'], // it can be multiple file. For multiple file use array with proper path
  output: {// this is for output where you want to put your file after complete build process
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {// here we will load some external resource. which we are using to build our project
    rules: [
      {
        test: /\.js$/, // it will find all js
        use: 'babel-loader', // which will perform some functioanlity during build process.
        exclude: [/node_modules/, /dist/], // expect this
      },
      {
        test: /\.js$/,
        include: [/src/, /tests/],
        loader: 'eslint-loader',
        options: {
          //fix: true
        }

      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      },
      // Font-awesome 4.7.X
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
        include: [/font-awesome/],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: 'assets',
    }]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'dependency',
    }),
    new CleanWebpackPlugin(['dist']),
  ], /*  ,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 5000,
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000',
                secure: false
            }
        }
    } */
};
