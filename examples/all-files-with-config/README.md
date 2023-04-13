# Example: all-files-with-config

Use [jest-environment-obsidian](../../) with all test files in the project, and specify your own jest configuration to go with it.

## Usage

Create a `jest.config.cjs` file with the following contents:

```js
const { extend } = require('jest-environment-obsidian/jest-preset');

module.exports = extend({
	moduleNameMapper: {
		'$my-module': './my-module.ts',
	},
});
```

## Advantages

- Simple to set up.
- Works in every test file.
- Less likely to have issues with future Jest versions.

## Disadvantages

- Cannot run different test environments in different files.
- More boilerplate than using the preset.
