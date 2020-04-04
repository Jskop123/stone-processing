/* eslint-disable */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[ '@babel/preset-env', {
									'targets': {
										'node': 'current'
									}
								} ]
							]
						}
					},
					{ loader: 'eslint-loader' }
				] 
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './public/index.html' }),
		new CopyWebpackPlugin([{ from: 'public/assets', to: 'assets' }])
	],
	devServer: { port: 3000 }
}