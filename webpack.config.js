const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  cli: './src/cli/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
 
    ],
  },
  devtool: 'source-map',
  target: 'node',
  externals: {
    os: 'commonjs os',
    fs: 'commonjs fs',
    typescript: 'typescript'
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ]
};
