const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {

	return {
		entry: './src/main.ts',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
			publicPath: '/bcf-viewer/',
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader'
					],
				},
				{
					test: /\.(png|jpg|gif|svg)$/,
					type: 'asset/resource',
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				// Process favicon paths based on public path
				templateParameters: {
					publicPath: publicPath,
				},
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'public',
						to: '.',
						globOptions: {
							ignore: ['**/.*'],
						},
					},
				],
			}),
			...(isProduction ? [
				new MiniCssExtractPlugin({
					filename: 'styles/main.css',
				})
			] : []),
		],
		devtool: 'source-map',
		devServer: {
			static: './dist',
			hot: true,
		},
	};
};