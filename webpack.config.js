const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	// Use root path for custom domain deployment
	// see https://github.com/orgs/community/discussions/173106
	// for discussion
	// => currently it's not possible to deploy to a subpath with GH Pages
	const publicPath = '/';

	return {
		entry: './src/main.ts',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
			// Set public path - configurable via environment variable
			publicPath: publicPath,
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