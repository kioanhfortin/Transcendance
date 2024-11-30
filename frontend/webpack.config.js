const path = require('path');

module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
        ],
    },
};