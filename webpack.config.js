var path = require('path')
var webpack = require('webpack')

let production = process.env.NODE_ENV === 'production'
console.log(production ? 'production build!!' : 'dev build!!')

const mainOption = {
  entry: {
    scriptdown: ['./src/']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: production ? '[name].min.js' : '[name].js'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devtool: '#source-map'
}

if (production) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  for (let option of module.exports) {
    option.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ])
  }
}

module.exports = [mainOption]
