const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(glb|gltf|png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(frag|vert)$/i,
                use: 'raw-loader',
            },
        ],
    },
    plugins: [
        new WriteFilePlugin(),
        new CopyPlugin(
            [
                {
                    from: '**/*',
                    to: '',
                    context: 'src/',
                }
            ],
            {
                ignore: ['*.js'],
            }
        ),
    ],
};