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

You can either specify the environment for all tests it to your `jest.config.js` file, or at the top of a test file as a doc block pragma comment.

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

## Configuration

The test environment can be configured globally with the `testEnvironmentOptions` option inside your Jest config, or on a per-file basis using one of the supported doc block pragmas.


### `conformance`

Configures how strictly the test environment tries to conform to Obsidian's implementation of its API.

When set to `strict`, certain functions and behaviours will work as though they were running within the real Obsidian environment. As a consequence, more boilerplate code will be needed for certain unit tests to pass.

**Pragma:** `@obsidian-conformance`  
**Options:** `"lax"`, `"strict"`  
**Default:** `"lax"`  

### `ignoreWarnings`

Disables printing of specific [warning messages](#warnings).

**Pragma:** `@obsidian-jest-ignore`  
**Options:** A string array of warning IDs, or a single string ID if within a pragma comment.  
**Default:** `[]`  

## Contributing
Want to help out? Check out the [contributing guide](./CONTRIBUTING.md)!
