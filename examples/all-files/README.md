# Example: all-files

Use [jest-environment-obsidian](../../) with all test files in the project.

## Usage

Create a `jest.config.cjs` file with the following contents:

```js
module.exports = {
	preset: 'jest-environment-obsidian',
}
```

## Advantages

- Simple to set up.
- Works in every test file.
- Less likely to have issues with future Jest versions.

## Disadvantages

- Cannot run different test environments in different files.
