# Contributing Guide

Thank you for taking an interest in contributing to `jest-environment-obsidian`! This small guide will familiarize you with the procedures and design of this project.

**Table of Contents:**

-   1.0 [Project Structure](#10-project-structure)

    -   1.1 [Interaction with Jest](#11-interaction-with-jest)
    -   1.2 [Repository Structure](#12-repository-structure)
    -   1.3 [Validation Plugin](#13-validation-plugin)

-   2.0 [Setup](#20-setup)

-   3.0 [Development](#30-development)

    -   3.1 [Code Consistency](#31-code-consistency)
    -   3.2 [Commit Consistency](#32-commit-consistency)
    -   3.3 [Creating Releases](#33-creating-releases)

-   4.0 [Testing](#40-testing)
    -   4.1 [Running Tests](#41-running-tests)
    -   4.2 [Writing Tests](#42-writing-tests)
    -   4.3 [Writing Validation Tests](#43-writing-validation-tests)

&nbsp;

---

&nbsp;

## (1.0) Project Structure

This section will describe how `jest-environment-obsidian` works and how the repository is structured.

### (1.1) Interaction with Jest

`jest` environments are used to create the V8 context (global scope) that the unit tests run under. Typically, this involves creating a self-contained "globals" object and using that as the context.

To work around limitations with the APIs available to custom environments, this project has to take a slightly different approach, however. The W3C DOM API is implemented as usual, but the `obsidian` module shims and prototype extensions must be loaded _within_ the unit test context.

During the environment setup phase, `jest-environment-obsidian` adds a global instance of the [RuntimeGateway](./src/gateway.ts) class to the unit test context. This instance exists under the NodeJS context (and thus has access to NodeJS modules), and acts as both a bridge between the two contexts and as a container for storing stateful data (e.g. Obsidian singletons) that may need to be cleared before each test.

![Diagram of how jest-environment-obsidian interacts with jest.](./diagrams/interaction-with-jest.svg)

`jest-environment-obsidian` is slightly unconventional in how it interacts with `jest`

The repository contains two important folders, `src`, and `validation`.

The `src` folder contains the [project source code and unit tests](#11-source-folders). The folder itself contains the code that sets up the Jest environment, while the `src/mock` folder contains the shimmed implementations of Obsidian's public API.

The `validation` folder contains an Obsidian plugin that is used to validate our unit tests against Obsidian's implementation. This works by added a lightweight Jest test runner to the plugin bundle, and then running the tests within the Obsidian application itself.

### (1.2) Repository Structure

The repository structure tries to be as straightforward as possible:

-   `src` contains the source code and tests for the project;
-   `scripts` contains scripts used for testing and building the project;
-   `testutil` contains utilities used inside tests (which are not published); and
-   `validation` contains a [plugin for validating tests against Obsidian's API implementation](#13-validation-plugin).

Inside the `src` directory, code is further split up in to three different locations:

-   `src/runtime/` contains code that will only be run within the unit test context;
-   `src/setup/` contains code that is only used for setting up the environment; and
-   `src/*.ts` contains common code that either may be loaded multiple times and used in both contexts (such as utility functions or type definitions), or loaded in the default NodeJS context and exposed to the unit test context (such as the `RuntimeGateway`).

The `testutil` directory contains a barebones implementation of a JSX factory along with some functions to make writing tests for `jest-environment-obsidian` easier.

### (1.3) Validation Plugin

The `validation` folder contains a full Obsidian plugin and a custom-made, lightweight, in-browser Jest runtime called `joker`. It is organized similarly to the Obsidian plugin template, with the only change being that it has source files located inside the `validation/src` directory.

For more info on the validation plugin, see [Section 4.3](#43-writing-validation-tests).

&nbsp;

## (2.0) Setup

To set up your local copy of `jest-environment-obsidian`, you need:

-   NodeJS version `19.8.0` or newer.
-   NPM version `9.5.0` or newer

If you meet these requirements (or are willing to try risking it with older versions), `cd` in to the repository directory and run `npm ci`. This will download the project dependencies and build tools.

### (2.1) Building

The project is bundled with `

&nbsp;

## (3.0) Development

When adding functionality to or changing code within `jest-environment-obsidian`, please keep a couple things in mind:

### (3.1) Code Consistency

Every file in this project has a purpose and is designed to be both approachable for new contributors, and maintainable for existing project maintainers.

If you need to create a new file, please keep the "[!]"-marked tips under [Section 1.1](#11-source-folders) in mind. Similarly, try to keep modules cohesive ("contains related code") and decoupled ("not tangled together with other modules").

We also provide a code formatter as part of the developer dependencies for `jest-environment-obsidian`. While it isn't a strict requirement to format your code before each commit, you can help keep things clean by running `npm run format` (or `yarn format`) before running `git add`.

### (3.2) Commit Consistency

When making commits, we have a couple requests:

1. Running `npm test` should pass.
2. Each commit should only change one feature.
3. The commit message should follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

If your pull request contains commits that don't follow those requests, it may take longer for us to review and merge your pull requests.

If you want to help us out, you can:

-   Run `npx husky install` to set up automatic linting for `git commit` messages; and
-   Create small but frequent commits.  
    It's easier for us to squash a commit than it is to break one apart :)

### (3.3) Creating Releases

We use a `tag-to-release` workflow for `jest-environment-obsidian`.

For a maintainer to create a release, a couple things need to be done:

1. Update the `version` in [package.json](./package.json).
2. Run `npm install --package-lock-only` to update the package lock.
3. Commit the changes:

    ```bash
    git add package.json package-lock.json
    git commit -m "chore: bump version to $(jq -r .version package.json)"
    ```

4. Tag the commit and push both the tag and to `main`:

    ```bash
    git tag v"$(jq -r .version package.json)"
    git push origin main
    git push origin v"$(jq -r .version package.json)"
    ```

5. Wait for [the release workflow](https://github.com/obsidian-community/jest-environment-obsidian/actions/workflows/create-release.yml) to finish.

&nbsp;

## (4.0) Testing

Being a project about unit tests, we make sure to use unit tests to test the project itself. If that sentence was confusing to understand, don't worry: we also have that problem. When we want to refer to a test _about_ `jest-environment-obsidian`'s code or behaviour, we will call it a "meta-test".

`jest-environment-obsidian` contains meta-tests in the form of `jest` unit test files. These meta-tests come in two flavors: internal meta-tests, and validation meta-tests.

_Internal_ meta-tests are used for test-driven-development and regression testing against internal code. _Validation_ meta-tests, on the other hand, are used to validate our Obsidian API shims against Obsidian's API implementation.

### (4.1) Running Tests

To run meta-tests, use `npm test` or `yarn test`.

#### Running Validation Tests in Obsidian

Running validation meta-tests inside Obsidian is a bit more of an involved process than running them through `jest`. Essentially, it involves building the plugin, manually copying its `manifest.json`, `styles.css`, and `main.js` file into Obsidian, reloading Obsidian, and pressing the run button in the settings tab.

First, you need to install the dependencies for building the validation plugin:

```bash
cd validation
npm install
```

Next, build the plugin:

```bash
npm run build
```

And then, copy it to some Obsidian vault.

```bash
# For Linux/MacOS:
OBSIDIAN_VAULT="/path/to/my/vault"
PLUGIN_DIR="$OBSIDIAN_VAULT/.obsidian/plugins/jest-environment-obsidian"
[ -d "$PLUGIN_DIR" ] || mkdir -p "$PLUGIN_DIR"
cp "manifest.json" "$PLUGIN_DIR/"
cp "styles.css" "$PLUGIN_DIR/"
cp "main.js" "$PLUGIN_DIR/"
```

From here, you need to reload Obsidian with the "Reload app without saving" command and run the plugin through its settings tab.

### (4.2) Writing Tests

When creating meta-tests, the unit test file should be located next to the module that is being tested. For example, if you have `src/component/ButtonComponent.ts`, its corresponding file would be `src/component/ButtonComponent.test.ts`.

When creating the test functions, we try to follow this flowchart:

![Flowchart](./diagrams/test-structure-flowchart.svg)

#### JSX Syntax

If you need DOM elements in your meta-tests, you can use the `.tsx` file extension and use JSX syntax.

Keep in mind that while you are using JSX syntax, **IT IS NOT REACT**. The JSX is converted into a series of `document.createElement()` calls that set the attributes of the elements to the `toString()` version of the props you provide. You will be working with regular DOM nodes; there will be no access to React hooks or types.

Basically,

```tsx
const myDiv: HTMLDivElement = <div className="foo">bar</div>;

// Turns into.

const myDiv = (() => {
	const PROP_FOO = "foo";
	const PROP_CHILDREN = "bar";

	const node_2: TextNode = document.createTextNode(`${PROP_CHILDREN}`);
	const node_1: HTMLDivElement = document.createElement("div");
	node_1.setAttribute("class", `${PROP_FOO}`);
	node_1.appendChild(node_2);

	return node_1 as HTMLElement;
})();
```

### (4.3) Writing Validation Tests

When creating validation tests, you need to ensure that the test is running under the `#meta-test/validation` environment. You should have a multi-line docblock comment that looks like this:

```typescript
/**
 * @jest-environment #meta-test/validation
 */
import {...} from "./my-file.ts";
```

Once that is added, the test will automatically be added to the validation plugin.

#### Limitations

When writing validation meta-tests, there are also a few limitations:

-   Some features of Jest (e.g. mocks) are unsupported/unimplemented in the in-browser test runner used by the validation plugin.

-   When running the validation plugin, if you get an error about an `expect(...)` function being unimplemented, it means that the in-browser test runner doesn't have that specific function implemented.

    If it's possible to do within the browser, you can add an implementation of the `expect` function to [validation/src/joker-expect.ts](./validation/src/joker-expect.ts).

-   The only test hooks that are available inside the browser are `beforeEach` and `afterEach`.
