import type EnvironmentOptions from '#options';

import type JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * The global variables within the environment context.
 */
export type Globals = JSDOMEnvironment['global'] & {
	[Options]: Readonly<EnvironmentOptions>;
};

const Options = `__JEST_ENVIRONMENT_OBSIDIAN_OPTIONS__`;

/**
 * Adds the `jest-environment-obsidian` options to the context.
 * This lets the shimmed Obsidian module behave differently depending on options.
 *
 * @param context The environment context.
 * @param options The options to add.
 */
export function setOptions(context: Globals, options: EnvironmentOptions) {
	function deepClone<T extends object>(obj: T): Readonly<T> {
		const copy: Record<string, any> = obj instanceof Array ? [] : {};

		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'object' && value !== null) {
				copy[key] = deepClone(value);
			} else {
				copy[key] = value;
			}
		}

		Object.freeze(copy);
		Object.preventExtensions(copy);
		Object.seal(copy);

		return copy as Readonly<T>;
	}

	Object.defineProperty(context, Options, {
		enumerable: false,
		configurable: false,
		writable: false,
		value: deepClone(options),
	});
}

export function getOptions(context: Globals): Readonly<EnvironmentOptions> {
	return context[Options];
}

/**
 * Gets the current `jest-environment-obsidian` options.
 * This is expected to be called from within the context.
 *
 * @returns The options.
 */
export function getOptionsWithinContext(): Readonly<EnvironmentOptions> {
	return (globalThis as unknown as Globals)[Options];
}
