module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }], // Node
		'@babel/preset-typescript', // TypeScript
	],

	plugins: [
		['babel-plugin-replace-ts-export-assignment'],
		[
			'@babel/plugin-transform-react-jsx',
			{
				throwIfNamespace: false,
				runtime: 'automatic',
				importSource: '#testutil/jsx',
			},
		],
	],
};
