const path = require('path');

module.exports = {
  mode: 'production', // Use 'development' for debugging or 'production' for release.
  entry: './src/index.ts', // Entry point of your library.
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory.
    filename: 'index.js', // Output file name.
    library: {
      type: 'commonjs2', // CommonJS for Node.js usage.
    },
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these file extensions.
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader', // Transpile TypeScript to JavaScript.
        exclude: /node_modules/,
      },
      // {
      //   test: /\.js$/,
      //   use: 'source-map-loader', // Handle source maps for debugging.
      //   enforce: 'pre',
      // },
    ],
  },
  devtool: 'source-map', // Generate source maps for debugging.
  target: 'node', // Ensure compatibility with Node.js.
  externals: {
    // Prevent bundling Node.js built-in modules like 'os' or 'fs'.
    os: 'commonjs os',
    fs: 'commonjs fs',
  },
};
