const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  resolve: {
    fallback: {
      'fs': false,
      'os': false,
      'path': false,
    },
  },

  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'JSON-NETS',
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'src/style.css',
    }),
    new MonacoWebpackPlugin({
      languages: ['json', 'jsonnet'],
    }),

  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            // options...
          },
        },
      ],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },

    // This seems to create problems with Monaco,
    // but apparently, it also isn't needed?
    //    {
    //      test: /\.ttf$/,
    //      use: ['file-loader'],
    //    },
    {
      test: /\.html$/i,
      loader: 'html-loader',
    },
    ],
  },
};
