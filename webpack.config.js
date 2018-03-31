const path = require('path');
const mode = process.env.NODE_ENV === 'dev' ? 'development' : 'production'
let outputPath, target
if (mode === 'development') {
  outputPath = path.resolve(__dirname, 'test')
  target = 'window'
} else {
  outputPath = path.resolve(__dirname, 'dist')
  target = 'umd'
}

module.exports = {
  entry: {
    main: './src/channel.js'
  },
  output: {
    path: outputPath,
    filename: 'channel.js',
    libraryTarget: target,
    library: 'TabChannel'
  },
  mode: mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ]
      }
    ]
  }
};