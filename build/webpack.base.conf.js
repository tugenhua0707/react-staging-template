
// webpack.base.conf.js 文件

const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: "babel-loader",
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192,
          }
        }
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  }
};