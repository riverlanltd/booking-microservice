const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/client/src/index.jsx'),
  output: {
    filename: 'bookingbundle.js',
    path: path.join(__dirname, '/client/dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        exclude: path.join(__dirname, '/node_modules/'),
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react', 'es2015'],
          plugins: ['transform-class-properties'],
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.scss?/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
};
