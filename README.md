# jest-environment-obsidian

![Obsidian Version Supported: v1.1.16](https://img.shields.io/badge/Obsidian-v1.1.16-blueviolet)
[![NPM Downloads](https://img.shields.io/npm/dm/jest-environment-obsidian?label=Downloads)](https://www.npmjs.com/package/jest-environment-obsidian)
[![MIT License](https://img.shields.io/github/license/eth-p/jest-environment-obsidian?label=License&style=flat)](https://github.com/eth-p/jest-environment-obsidian/blob/main/LICENSE)
[![Checks](https://github.com/eth-p/jest-environment-obsidian/actions/workflows/commit-checks.yml/badge.svg?event=push)](https://github.com/eth-p/jest-environment-obsidian/actions/workflows/commit-checks.yml)

A [Jest](https://jestjs.io/) environment to facilitate unit testing for [Obsidian](https://obsidian.md/) plugins.

> **Notice:**  
> This project is a work-in-progress.
>
> Obsidian's API is fairly large, and it will take time to implement all of it in a test-friendly way. If some function doesn't work, please open an issue or pull request.

## Installation

This package is available on the `npm` registry. You can install it using `npm` or `yarn`.

```bash
npm install --save-dev jest-environment-obsidian
```

### Requirements

These are the minimum requirements that we test for. You may have luck with earlier versions of the required software, but we won't be able to provide support for it.

-   `NodeJS` >= 15.0.0
-   `Jest` >= 29.0.0

## Usage

There are two ways to use `jest-environment-obsidian` in your project: for all unit tests, or for specific unit test files. If you're not sure about what you want to do, you can see [our examples](./examples/) for inspiration.

### For All Tests

If you want to use `jest-environment-obsidian` for all your unit tests, you can use `jest-environment-obsidian` as a preset. This will add the required setup files and module resolver.

```js
module.exports = {
	// ...
	preset: 'jest-environment-obsidian',
};
```

If you want to provide your own configuration on top of `jest-environment-obsidian`'s preset, we recommend using the `extend` function provided in our preset:

```js
const { extend } = require('jest-environment-obsidian/jest-preset');
module.exports = extend({
	setupFiles: ['...'],
});
```

### For Individual Tests

If you only want to test a specific files under the `jest-environment-obsidian` environment, you can add a multi-line pragma comment at the top your unit test file:

```js
/**
 * @jest-environment jest-environment-obsidian
 */
```

## Features

### Obsidian's Prototype Extensions

Obsidian adds custom functions and properties to existing DOM and ECMAScript types. These have been reimplemented under `jest-environment-obsidian` and are available within unit tests.

### Obsidian Module

The Obsidian module is automatically shimmed for you. While it's still good practice to isolate code, as long as you use `jest-environment-obsidian`, having `import {...} from "obsidian"` in source files no longer prevents unit tests from running.

### Warnings

As a way to help with test-driven-development and identify why certain unit tests may be failing, `jest-environment-obsidian` creates and prints warning messages after running tests.

Individual warnings can be disabled by adding a `@obsidian-jest-ignore node-must-be-within-document <warningName>` pragma comment in a file. Multiple comments can be added to disable different warnings.

## Configuration

The test environment can be configured globally with the `testEnvironmentOptions` option inside your Jest config, or on a per-file basis using one of the supported doc block pragmas.

### `conformance`

Configures how strictly the test environment tries to conform to Obsidian's implementation of its API.

When set to `strict`, certain functions and behaviours will work as though they were running within the real Obsidian environment. As a consequence, more boilerplate code will be needed for certain unit tests to pass.

**Pragma:** `@obsidian-conformance`  
**Options:** `"lax"`, `"strict"`  
**Default:** `"lax"`

### `version`

Configures the reported `apiVersion` inside the `obsidian` module.

**Pragma:** `@obsidian-version`  
**Options:** `string`  
**Default:** `1.1.16`

### `ignoreWarnings`

Disables printing of specific [warning messages](#warnings).

**Pragma:** `@obsidian-jest-ignore`  
**Options:** A string array of warning IDs, or a single string ID if within a pragma comment.  
**Default:** `[]`

### `missingExports`

Changes how `jest-environment-obsidian` handles missing exports from shimmed modules.
By default, a warning will be emitted to let you know that your tests may behave unexpectedly.

**Options:** `"warning", "error", "undef"`  
**Default:** `"warning"`


## Contributing

Want to help out? Check out the [contributing guide](./CONTRIBUTING.md)!
