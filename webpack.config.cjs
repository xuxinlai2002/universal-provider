const path = require('path');
const webpack = require('webpack');
const bundleAnalyzerPlugin = require('webpack-bundle-analyzer');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development', // "production" 或 "development"
  entry: './src/index.js', // 应用的入口点
  output: {
    filename: 'okxconnect_universal.js',
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    library: 'OKXConnectUniversal',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // 匹配所有 .ts 文件
        use: 'ts-loader', // 使用 ts-loader 处理 TypeScript 文件
        exclude: /node_modules/ // 排除 node_modules 目录
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'], // 自动解析确定的扩展
    fallback: { "stream": false }, // 如果需要的话，可以添加更多 fallback 配置
  },
  stats: {
    errorDetails: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  // 添加其他配置如 loaders 和 plugins
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // new bundleAnalyzerPlugin.BundleAnalyzerPlugin()
  ],
};
