# jest-environment-obsidian

A [Jest](https://jestjs.io/) environment to facilitate unit testing for Obsidian plugins.

> **Notice:**  
> This project is a work-in-progress.
>
> Obsidian's API is fairly large, and it will take time to implement all of it in a test-friendly way. If some function doesn't work, please open an issue or pull request.

## Installation

This package is available on the `npm` registry. You can install it using `npm` or `yarn`.

```bash
npm install --save-dev jest-environment-obsidian
```

## Usage

You can either specify the environment for all tests it to your `jest.config.js` file, or at the top of a test file as a doc comment.

### For All Tests

Inside of `jest.config.js`, add the `testEnvironment` option with a value of `"jest-environment-obsidian"`.

```js
module.exports = {
	// ...
	testEnvironment: "jest-environment-obsidian"
}
```

### For Individual Tests

At the top of your `(something).test.ts` file, add the following multi-line comment:

```js
/**
 * @jest-environment jest-environment-obsidian
 */
```

## Contributing
Want to help out? Check out the [contributing guide](./CONTRIBUTING.md)!
