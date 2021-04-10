/**
 * Local Server
 *
 * This is the webpack configuration that is for local development
 *
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const WatchRunPlugin = require('./build/webpackWatch');
import builder from './build/json/builder';
const localeConfig = require('locale/US'); // to do  - dynamic resolve using country
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Clean up .env files
const loadEnvData = require('./build/env/' + env + '.env.js')
const configEnv = require('./build/config/apiConfig.js');
let resultConfig = configEnv(loadEnvData);

// Containers and template information is specified in appConfig.js 
const appConfig = require('./build/config/appConfig.js');
const { container, configuratorTemplate, currencySymbol } = getAppConfig(familyType, appConfig);
resultConfig.currencySymbol = appConfig.currencySymbol;
resultConfig.buildFeatures = loadEnvData.buildFeatures;

// If container is specified, use that. Else use normal app. Format is app/AppIndex.js
const entryFile = (container && container != 'configurator') ? `apps/${container}/${container[0].toUpperCase()}${container.slice(1)}Index.js` : 'src/index.js';
const templateFile = template ? 'build/templates/' + template + '.ejs' : 'src/index.ejs'; // Pass template to render in a custom template


module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: 'eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, entryFile)
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    //new BundleAnalyzerPlugin(), //enable it whenever need to analyze the bundle size
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      options: {
        commit: 'local',
        newRelic: ''
      },
      template: templateFile,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inject: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      noInfo: true,
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, 'src', 'scss')]
        },
        context: '/',
        postcss: () => [autoprefixer],
      }
    }),
    new CopyWebpackPlugin([
      { from: 'static', to: 'static' }
    ]),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new WatchRunPlugin({
      builder,
      familyType
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@src': path.resolve(__dirname, 'src'),
      '@apps': path.resolve(__dirname, 'apps'),
      '@static': path.resolve(__dirname, 'static'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      'core-js': path.resolve('./node_modules/core-js'),
      //'react-dom': path.resolve('./node_modules/@hot-loader/react-dom'), this is referring to another version of react dom when hooks won't allow
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react': path.resolve('./node_modules/react'),

    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,

        /* These folders are transpiled by babel - the fewer items, the faster the process */
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "apps")
        ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          mimetype: "application/font-woff",
          name: "./theme/fonts/[name].[ext]"
        }
      },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options:
            {
              sourceMap: true,
              importLoaders: true,
              modules: false,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              minimize: false,
            },
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};


