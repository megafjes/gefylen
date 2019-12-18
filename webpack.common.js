const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main/index.js',
    giants: './src/projects/giants/giants.js',
    experiments: './src/projects/experiments/experiments.js',
    starmap: './src/projects/starmap/starmap.js',
    studentflow: './src/projects/studentflow/studentflow.js'
    //hap: './src/projects/hap/hap.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/main/index.html',
      inject: true,
      chunks: ['main'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'The greatest ape',
      chunks: ['giants'],
      filename: 'giants/index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Experiments',
      chunks: ['experiments'],
      filename: 'experiments/index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Starmap',
      chunks: ['starmap'],
      filename: 'starmap/index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Student flow',
      chunks: ['studentflow'],
      filename: 'studentflow/index.html'
    }),
    // new HtmlWebpackPlugin({
    //   title: 'Hap',
    //   chunks: ['hap'],
    //   filename: 'hap/index.html'
    // })
    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   as(entry) {
    //     if (/\.css$/.test(entry)) return 'style';
    //     if (/\.(woff|woff2|eot|ttf|otf)$/.test(entry)) return 'font';
    //     if (/\.(png|jpg|jpeg|gif)$/.test(entry)) return 'image';
    //     return 'script';
    //   }
    // }),
    new FaviconsWebpackPlugin()
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        // options: {
        //   publicPath: './fonts/',
        //   name: "../fonts/[name].[ext]",
        //   limit: 1000
        // }
      },
      {
        test: /\.(csv|tsv)$/,
        exclude: /node_modules/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      },
      {
        test: /\.xml$/,
        exclude: /node_modules/,
        use: [
          'xml-loader',
        ],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          'svg-inline-loader'
        ]
      },
    ]
  }
};