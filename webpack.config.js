/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx'),
  },
  target: 'web',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: 'ts-loader',
      },
      {
        test: /\.module\.(c|sc|sa)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
              sourceMap: !isProduction,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.(c|sc|sa)ss$/i,
        exclude: /\.module\.(c|sc|sa)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[name]_[global]_[hash:base64:5]',
              },
              sourceMap: !isProduction,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.(glsl|frag|vert|comp)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          {
            loader: 'glslify-loader',
            options: {
              transform: [['glslify-hex', { 'option-1': true, 'option-2': 42 }]],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '[path][name].[ext]',
        },
      ],
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    port: 3000,
    compress: true,
    open: false,
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true,
    host: 'localhost',
  },
}
