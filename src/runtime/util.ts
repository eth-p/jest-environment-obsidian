import { PACKAGE_NAME, RUNTIME_STATE_GLOBAL_NAME } from '../constants';
import type RuntimeGateway from '../gateway';
import { WarningParameters, WarningTypeByName, WarningTypes } from '../warning-collection';

export type Environment = RuntimeGateway;
export { getCallerName } from '../util';

export function getEnvironment(): Environment {
	const env = (globalThis as typeof globalThis & { [RUNTIME_STATE_GLOBAL_NAME]: Environment })[
		RUNTIME_STATE_GLOBAL_NAME
	];

	if (env == null) {
		throw new Error(
			[
				`Failed to access ${PACKAGE_NAME} runtime from tests.`,
				'Was the test environment specified correctly?',
			].join('\n'),
		);
	}

	return env;
}

/**
 * A placeholder that throws an error and instructions on how to contribute.
 */
export function __UNIMPLEMENTED__(): never {
	const stack = new Error().stack!;
	const source = stack.split('\n')[2];
	const [_, space, name, loc] = /^(\s*)at (.*?) \((.*)\)/.exec(source)!;

	const err = new Error(
		`The \`${name}\` function is unimplemented in ${PACKAGE_NAME}.\n\n` +
			`If your tests rely on this function, please consider opening a pull request at ` +
			`https://github.com/obsidian-resources/jest-environment-obsidian ` +
			`to add an implementation.`,
	);

	err.stack = `${err.toString()}\n${space}at ${name} (${loc})`;
	throw err;
}

/**
 * Adds a warning under the current test suite.
 *
 * @param type The warning type.
 * @param caller The calling function.
 * @param params The warning parameters.
 */
export function __WARNING__<T extends keyof WarningTypes>(
	type: T,
	caller: string | null,
	...params: WarningParameters<WarningTypeByName<T>>
): void {
	const env = getEnvironment();
	env.warnings.add(type, caller, ...params);
}
