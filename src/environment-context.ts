import type EnvironmentOptions from '#options';

import type JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * The global variables within the environment context.
 */
export type Globals = JSDOMEnvironment['global'] & {
	[Options]: Readonly<EnvironmentOptions>;
	[State]: Map<string, unknown>;
};

const Options = `__JEST_ENVIRONMENT_OBSIDIAN_OPTIONS__`;
const State = `__JEST_ENVIRONMENT_OBSIDIAN_STATE__`;

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

/**
 * Resets all the state for `jest-environment-obsidian`.
 * This is expected to be called from within the context.
 */
export function resetStateWithinContext(): void {
	(globalThis as unknown as Globals)[State] = new Map();
}

/**
 * Gets the some state for `jest-environment-obsidian`.
 * This is expected to be called from within the context.
 *
 * @param key The key of the state to get.
 * @param factory A factory for building the state if it doesn't exist.
 *
 * @returns The state.
 */
export function getStateWithinContext<R>(key: string, factory: () => R): R {
	if (!(State in globalThis)) {
		(globalThis as unknown as Globals)[State] = new Map();
	}

	const stateMap = (globalThis as unknown as Globals)[State];
	let state: R;

	if (stateMap.has(key)) {
		state = stateMap.get(key) as R;
	} else {
		state = factory();
		stateMap.set(key, state);
	}

	return state;
}
