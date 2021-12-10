import path from 'path';
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import DotEnv from "dotenv-webpack";
import baseConfig from './webpack.base.babel';

export default {
  ...baseConfig,
  devtool: 'cheap-module-source-map',
  devServer: {
    static: {
      publicPath: '/',
    },
    hot: true,
    host: '0.0.0.0',
    port: 6060,
    historyApiFallback: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: {
      '/api/en/v1': {
        target: 'https://example.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    ...baseConfig.plugins,
    new ReactRefreshPlugin(),
    new DotEnv({
      path: path.resolve(__dirname, '../dev.env')
    })
  ]
}
