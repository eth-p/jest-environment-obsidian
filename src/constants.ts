/**
 * The name of the current package.
 * For this project, it's expected to be `jest-environment-obsidian`.
 */
export const PACKAGE_NAME = 'jest-environment-obsidian';

/**
 * The name of the global variable within the test context that exposes the `jest-environment-obsidian` runtime state
 * to the `obsidian` API implementation running within the test.
 */
export const RUNTIME_STATE_GLOBAL_NAME = '$$jest-environment-obsidian-runtime';

/**
 * The package name and subpath for modules and scripts that should be run inside the test context.
 */
export const RUNTIME_PACKAGE = `${PACKAGE_NAME}/test-runtime`;

/**
 * The latest Obsidian version.
 */
export const LATEST_OBSIDIAN_VERSION = '1.1.16';
