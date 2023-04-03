import { PACKAGE_ID } from './constants';

/**
 * A placeholder that throws an error and instructions on how to contribute.
 */
export function __UNIMPLEMENTED__(): never {
	const stack = new Error().stack!;
	const source = stack.split('\n')[2];
	const [_, space, name, loc] = /^(\s*)at (.*?) \((.*)\)/.exec(source)!;

	const err = new Error(
		`The \`${name}\` function is unimplemented in ${PACKAGE_ID}.\n\n` +
			`If your tests rely on this function, please consider opening a pull request at ` +
			`https://github.com/obsidian-resources/jest-environment-obsidian ` +
			`to add an implementation.`,
	);

	err.stack = `${err.toString()}\n${space}at ${name} (${loc})`;
	throw err;
}
