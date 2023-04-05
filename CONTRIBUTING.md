# Contributing Guide

Thank you for taking an interest in contributing to `jest-environment-obsidian`! This small guide will help familiarize you with the procedures and design of this project.

## Repository Structure

The repository contains two important folders, `src`, and `plugin`. The `src` folder contains the [project source code](#sources) and unit tests, and the `plugin` folder contains an Obsidian plugin to run the unit tests against Obsidian's actual API for validation purposes.

### Important Folders

- `src/mock/enhance/*`
  
  Prototype extensions to DOM or ECMAScript objects, encompassing functions like `Node.createEl`. The prototype extensions are injected into the global variables inside the test runner's environment.

- `src/module/obsidian.ts`
  
  Injected into the Jest module loader by the environment, this contains exports for the classes and functions in Obsidian's `obsidian` module.


## Testing

Where applicable, this project uses unit tests to prevent regressions and ensure that the behavior of `jest-environment-obsidian` shims match Obsidian's actual behavior as closely as possible.

### Validation

To validate that our tests conform to Obsidian's API implementation, we use a custom Obsidian plugin to load and run specific Jest tests inside the official environment.

Should the unit tests pass when run through `npm run test`, they should also pass when run within Obsidian. If they don't pass within Obsidian, the tests (and therefore, our implementation) do not correctly conform to the Obsidian API.

To add new tests to the Obsidian plugin, add a run-time import statement within [plugin/src/tests.ts](./plugin/src/tests.ts). Note that in order for tests to be identified correctly, they *must* be imported as `import("path/to/Something.test.ts")` and not as `import "path/to/Something.test.ts"!.

#### Limitations

Due to having to emulate the ABI of Jest within a browser environment, some features of Jest (e.g. mocks) are unavailable/unimplemented within the validation plugin.

If you run into this problem, separate the tests into two files and only include the browser-friendly one inside the validation plugin.

#### Unimplemented Expect Functions

When running the validation plugin, if you get an error about an `expect(...)` function being unimplemented, it means that our Jest-compatible test loader/runner doesn't have that specific function implemented.

If it's possible to do within the browser, you can add an implementation to [plugin/src/joker-expect.ts](./plugin/src/joker-expect.ts).

#### Unimplemented Setup/Teardown

Currently, Jest `beforeAll`/`afterAll` for setting up and tearing down tests aren't implemented. If the effort warrants it, this may be fixed in the future.

## Commits

The `jest-environment-obsidian` project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.


## Releases

(TODO)
