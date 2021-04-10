/**
 * Local dev server
 * This server/file is used only for local development.
 * Changing this will not affect any staging/production build.
 *
 */

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import proxy from 'http-proxy-middleware';
import config from '../webpack.config.dev';

const bundler = webpack(config);
browserSync({
  port: 3000,
  ui: false,
  ghostMode: false,
  server: {
    baseDir: 'src',
    middleware: [
      historyApiFallback(),
      webpackDevMiddleware(bundler, {
        publicPath: config.output.publicPath,
        noInfo: false,
        quiet: false,
        stats: {
          assets: false, children: false, chunks: false, modules: false, colors: true,
        },
      }),
      webpackHotMiddleware(bundler),
    ],
  },
  files: [
    'src/*.html', 'src/*.json',
  ],
});
