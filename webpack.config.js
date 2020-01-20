const path = require('path');
const webpack = require('webpack');

module.exports = () => {
  config = {
    module: {
      rules: []
    },
    resolve: {}
  };

  config.entry = {
    main: './index.web.js',
    // html: './index.html',
  };

  config.module.rules.push({
    test: /\.html$/,
    loader: "file-loader?name=[name].[ext]",
  });

  config.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: 'url-loader',
      options: { name: '[name].[ext]' }
    }
  });

  config.module.rules.push({
    test: /\.jsx?$/,
    include: [
      /index\.web\.js/,
      /src\/*/,
      /node_modules\/react-native\-?\/*/,
    ],
    // exclude: /node_modules\/(?!react\-native(\-web)?\/)/,
    use: [
      // 'react-hot',
      { 
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          // The 'react-native' preset is recommended to match React Native's packager
          presets: ['module:metro-react-native-babel-preset'],
          // Re-write paths to import only the modules needed by the app
          plugins: ['react-native-web']
        }
      }
    ]
  });

  // config.module.rules.push({
  //   test: /\.s[ac]ss$/i,
  //   exclude: /node_modules\/(?!react\-native\-web\/)/,
  //   use: [
  //     {
  //       loader: 'style-loader',
  //       options: {
  //         modules: true,
  //         sourceMap: true,
  //       }
  //     },
  //     {
  //       loader: 'sass-loader',
  //       options: {
  //         modules: true,
  //         sourceMap: true,
  //       }
  //     },
  //   ]
  // });

  config.module.rules.push({
    test: /\.(c|le)ss$/i,
    // exclude: /node_modules/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
        }
      },
      // 'less-loader'
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        }
      },
    ]
  });

  config.resolve.modules = ['node_modules']

  config.resolve.extensions = ['.webpack.js', '.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'];

  config.resolve.alias = {
    'aws-amplify-react-native': 'aws-amplify-react',
    'react-native$': 'react-native-web',
  };

  return config;
};
