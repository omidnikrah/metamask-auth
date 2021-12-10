import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import DotEnv from "dotenv-webpack";
import baseConfig from './webpack.base.babel';

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new CleanWebpackPlugin(),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
    new DotEnv({
      path: path.resolve(__dirname, '../prod.env')
    }),
  ].filter(Boolean),
  optimization: {
    ...baseConfig.optimization,
    minimizer: [
      new TerserPlugin(),
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}