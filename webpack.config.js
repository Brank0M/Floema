const path = require("path");
const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
  // Webpack configuration
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "main.scss")],
  resolve: {
    modules: [dirApp, dirAssets, dirShared, dirStyles, dirNode],
  },

  plugins: [
    // Webpack plugins
    new webpack.DefinePlugin({
      // Tells to build in either dev or prod mode. https://webpack.js.org/plugins/define-plugin/
      IS_DEVELOPMENT,
    }),
    new CopyPlugin({
      // Copies files from target to destination folder
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // Extracts CSS into separate files
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new ImageMinimizerPlugin({
      // Minifies images
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
          ],
        },
      },
    }),
    // new CleanWebpackPlugin(), // Cleans the output folder
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/, // Transpiles JavaScript files
        use: {  // replaced - use: "babel-loader",
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/, // Compiles Sass to CSS
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/i, // replaced with bottom comment
        type: 'asset/resource',
        // type: 'file-loader',
        generator: {
          filename: '[name].[hash].[ext]',
        },
      },
      // {
      // test: /\.(woff|woff2|eot|ttf|otf)$/i,
      // type: "asset/inline",
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg|woff|woff2|fnt|webp)$/i, // This section commented is not working properly, it has to be fixed
      //   loader: "file-loader",
      //   options: {
      //     name(file) {
      //       return "[hash].[ext]";
      //     },
      //   },
      // },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i, // Minifies images
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            // options: {
            //   minimizer: {
            //     implementation: ImageMinimizerPlugin.imageminMinify,
                // options: {
                //   plugins: [
                //     "imagemin-gifsicle",
                //     "imagemin-mozjpeg",
                //     "imagemin-pngquant",
                //     "imagemin-svgo",
                //   ],
                // },
              // },
            // },
          },
        ],
      },
      {
        test: /\.(glsl|frag|vert)$/, // Loads GLSL files
        type: "asset/source", // replaced - loader: "raw-loader",
        // type: "raw-loader", 
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/, // Compiles GLSL files
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
