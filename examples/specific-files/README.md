# Example: specific-files

Use [jest-environment-obsidian](../../) for specific unit test files.

## Usage

Create a `jest.config.cjs` file with the following contents:

```js
module.exports = {
	preset: 'jest-environment-obsidian',
};
```

## Advantages

-   Allows for multiple different test environments.
-   Simple to set up.

## Disadvantages

-   May have issues with future Jest versions.
