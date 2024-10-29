const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'okxconnect_universal.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'OKXConnectUniversalProvider',
      type: 'umd',
      umdNamedDefine: true
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    // 可以根据需要决定是否启用 BundleAnalyzerPlugin
    // new BundleAnalyzerPlugin()
  ]
};
