const conventional = require('@commitlint/config-conventional');

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				// Include the types from conventional commits.
				...conventional.rules['type-enum'][2],

				// Add custom types.
				'dev',
			].sort(),
		],
	},
};
