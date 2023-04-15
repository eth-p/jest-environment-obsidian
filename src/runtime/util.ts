import { PACKAGE_NAME, RUNTIME_STATE_GLOBAL_NAME } from '../constants';
import type RuntimeGateway from '../gateway';
import { WarningParameters, WarningTypeByName, WarningTypes } from '../warning-collection';

export type Environment = RuntimeGateway;
export { getCallerName } from '../util';
export { parseVersion, compareVersion } from '../utils-version';

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
		[
			`The \`${name}\` function is unimplemented in ${PACKAGE_NAME}.`,
			'',
			`If your tests rely on this function, please consider opening a pull request at`,
			`https://github.com/obsidian-community/jest-environment-obsidian/ `,
			`to add an implementation.`,
			'',
			'If you would like to bring attention to this function, please leave a comment at',
			'https://github.com/obsidian-community/jest-environment-obsidian/issues/1',
		].join('\n'),
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

/**
 * Wraps the module exports to either create a warning or throw an error when missing exports are accessed.
 *
 * @param name The module name.
 * @param exports The module exports.
 * @returns The wrapped exports object.
 */
export function createCheckedExporter<T extends Record<string, any>>(name: string, exports: T): T {
	const behavior = getEnvironment().options.missingExports;
	if (behavior === 'undef') return exports;
	return new Proxy(exports, {
		get(target: T, p: PropertyKey, _receiver) {
			if (p in target) {
				return target[p as keyof T];
			}

			// Special case: `then`
			// This commonly accessed to check if something is a promise.
			// We'll ignore it to prevent false positives.
			if (p === 'then') return undefined;

			// Get the stack and remove this function from it.
			const stack = new Error().stack!;
			const strippedStack = stack.split('\n').splice(1, 1).join('\n');
			const prop = p.toString();

			// If the property does not exist and we want a warning:
			if (behavior === 'warning') {
				__WARNING__('MissingExportStub', null, name, prop);
				return;
			}

			// If it should be an error:
			const error = new Error(
				[
					'jest-environment-obsidian does not have a stub for',
					`'${prop}' in the '${module}' module.`,
					'Please consider opening an issue or creating a pull request for this stub at',
					'',
					'https://github.com/obsidian-community/jest-environment-obsidian',
					'',
					'Alternatively, you can emit an undefined value or a warning by changing',
					'the `missingExports` environment option to either "undef" or "warning"',
				].join('\n'),
			);

			error.stack = strippedStack;
			throw error;
		},
	});
}
