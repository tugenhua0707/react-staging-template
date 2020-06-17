
// webpack.base.conf.js 文件

const path = require('path');
const webpack = require('webpack');

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 引入HappyPack插件 
const HappyPack = require('happypack');

module.exports = {
  entry: {
    app: './src/index.js',
    // framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        // use: "babel-loader",
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            // 一个loader对应一个id
            loader: "happypack/loader?id=jsBabel"
          }
        ]
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
  },
  resolve: {
    alias: {
      '@components': '../src/components'
    },
    extensions: ['.js', '.jsx', '.vue', '.ts']
  },
  plugins: [
    // 设置环境变量信息
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '..', 'dll/vendor.dll.js') // 对应的 dll 文件路径
    }),
    // 告诉webpack使用了哪些第三方库代码
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dll/vendor.manifest.json')
    }),
    
    new HappyPack({
      // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
      id:'jsBabel',
      // 如何处理.js文件，用法和Loader配置中一样
      loaders:['babel-loader'],
    }),

  ]
};