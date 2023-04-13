const { extend } = require('jest-environment-obsidian/jest-preset');

module.exports = extend({
	moduleNameMapper: {
		'\\$my-module': './my-module.ts',
	},
});
