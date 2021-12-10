import path from 'path';
import { DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { isDev, isDevServer, isProd, mode } from "./utils";

export default {
  context: path.resolve(__dirname, '..'),
  target: isDevServer ? 'web' : ['web', 'es5'],
  mode: isProd ? 'production' : 'development',
  entry: path.resolve(__dirname, '../src/app/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDevServer ? '[name].[fullhash].js' : '[name].[contenthash].js',
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@containers': path.resolve(__dirname, '../src/containers'),
      '@config': path.resolve(__dirname, '../src/config'),
      '@translations': path.resolve(__dirname, '../src/app/translations'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
          }
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'resolve-url-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: 'asset/inline',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/app/index.ejs'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      IS_PROD: isProd,
      IS_DEV: isDev
    }),
    new ForkTsCheckerWebpackPlugin({
      async: isDev,
      eslint: {
        enabled: true,
        files: path.resolve(__dirname, '../src/**/*.{ts,tsx,js,jsx}')
      }
    }),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      extensions: ['js', 'jsx', 'ts', 'tsx']
    }),
    // new CopyPlugin({
    //   patterns: [{
    //     from: path.resolve(__dirname, '../src/app/assets'),
    //     to: 'assets'
    //   }]
    // })
  ],
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
  }
}
