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

/**
 * Extends the static methods and instance methods of an object.
 *
 * @param target The constructor function of the type to extend.
 * @param extensions The extensions to add to the type.
 */
export function extendType<T extends { new (...args: any[]): any; prototype: Record<string, any> }, E extends T>(
	target: T,
	extensions: E,
): void {
	// Extend the constructor.
	class Empty {}
	for (const [prop, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(extensions))) {
		if (prop === 'prototype') continue;
		if (Object.getOwnPropertyDescriptor(Empty, prop)) continue;

		Object.defineProperty(target, prop, descriptor);
	}

	// Extend the prototype.
	if ('prototype' in target) {
		Object.defineProperties(target.prototype, Object.getOwnPropertyDescriptors(extensions.prototype));
	}
}

/**
 * Gets the name of the caller function.
 * @returns The caller function name, or null if it cannot be determined.
 */
export function getCallerName(): string | null {
	const stack = new Error().stack ?? '';

	const REGEX_STACK_TRACE_EXTRACT_FUNCTION = /\s*at ((?:.(?! \())+.)/;
	const REGEX_STACK_TRACE_CURRENT_FUNCTION = /^\s*at getCallerName/;

	const lines = stack.split('\n');
	const index = lines.findIndex((line) => REGEX_STACK_TRACE_CURRENT_FUNCTION.test(line)) + 2;

	return REGEX_STACK_TRACE_EXTRACT_FUNCTION.exec(lines[index])?.[1] ?? null;
}
