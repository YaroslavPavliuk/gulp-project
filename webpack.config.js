const config = {
	mode: 'production',
	entry: {
		main: './src/js/main.js',
    // test: './src/js/block/test.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
