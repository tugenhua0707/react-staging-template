
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入mock工具
const mocker = require('json-mocker-tool');

const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: { 
    filename: "js/[name].[hash:8].js",
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/, // 不检查的文件
        include: path.resolve(__dirname, '../src'), // 指定检查目录
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
            }
          }
        ],
        enforce: "pre", // 编译前检查
      },
      {
        test: /\.css$/,
        use: [ 
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      minify: {
        html5: true
      },
      hash: false
    }),
    // 进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`🐸 building...   ${~~(percentage * 100)}%`);
        stream.clearLine(1);
      } else {
        stream.cursorTo(0);
        stream.write(`🐸 ${msg}   ${~~(percentage * 100)}%`);
        stream.clearLine(1);
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: '8082',
    contentBase: path.join(__dirname, '../public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    open: false,
    stats: 'errors-only',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api' : ''  // 重写路径
        }
      }
    },
    before: app => {
      mocker({
        mockDir: path.resolve('./mock')
      })(app);
    }
  }
})