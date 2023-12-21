const webpack = require('webpack');
const config = {
    entry:  __dirname + '/scripts/index.js',
    devtool: 'inline-nosources-cheap-source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
            test: /\.(js|jsx)?/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', {
                      "targets": "defaults" 
                    }],
                    '@babel/preset-react'
                  ]
                }
              }]    
            }     
        ]
    }
};
module.exports = config;