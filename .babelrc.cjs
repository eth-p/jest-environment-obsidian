module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }], // Node
		'@babel/preset-typescript', // TypeScript
	],

	plugins: [
		[
			'@babel/plugin-transform-react-jsx',
			{
				throwIfNamespace: false,
				runtime: 'automatic',
				importSource: '#jsx',
			},
		],
	],
};
