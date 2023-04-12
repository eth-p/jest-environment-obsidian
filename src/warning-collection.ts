import { JestEnvironmentConfig } from '@jest/environment';

import EnvironmentOptions from './options';
import { AbstractWarning, printWarnings } from './warning';
import * as WarningTypesModule from './warning-types';

const REGEX_STACK_TRACE_AT_WARNING = /^\s*at __WARNING__/;
const REGEX_STACK_TRACE_EXTRACT_FUNCTION = /\s*at ((?:.(?! \())+.)/;

/**
 * A collection of warnings.
 */
export class WarningCollection {
	protected warnings: Set<AbstractWarning> = new Set();

	/**
	 * Adds a warning under the current test suite.
	 *
	 * @param state The environment context.
	 * @param type The warning type.
	 * @param caller The calling function.
	 * @param params The warning parameters.
	 */
	public add<T extends keyof WarningTypes>(
		type: T,
		caller: string | null,
		...params: WarningParameters<WarningTypeByName<T>>
	) {
		const warningClass = WarningTypesModule[type];
		const warningCaller =
			caller ??
			(() => {
				const stack = new Error().stack!.split('\n');
				const lineOfCaller = stack.findIndex((line) => REGEX_STACK_TRACE_AT_WARNING.test(line)) + 2;
				const traceOfCaller = stack[lineOfCaller];

				return REGEX_STACK_TRACE_EXTRACT_FUNCTION.exec(traceOfCaller)![1];
			})();

		this.warnings.add(Reflect.construct(warningClass, [warningCaller, ...params]));
	}

	/**
	 * The number of warnings accumulated during test execution.
	 */
	public get count(): number {
		return this.warnings.size;
	}

	/**
	 * Clears all the warnings.
	 */
	public clear(): void {
		this.warnings.clear();
	}

	/**
	 * Prints the accumulated warnings.
	 *
	 * @param writer Called to print the message somewhere.
	 * @param options Environment options.
	 * @param config Project config.
	 *
	 * @internal
	 */
	public print(writer: (message: string) => any, options: EnvironmentOptions, config: JestEnvironmentConfig): void {
		printWarnings(writer, this.warnings, options, config);
	}
}

/**
 * A type representing a map of warning types.
 */
export type WarningTypes = {
	[K in keyof typeof WarningTypesModule]: typeof WarningTypesModule[K]
};

/**
 * A type lookup table for getting the type of a warning by its class name.
 * 
 * ```ts
 * WarningTypeByName<"MyWarning"> = typeof Resolved<import("warning-types.ts")>.MyWarning;
 * ```
 */
export type WarningTypeByName<K extends keyof WarningTypes> = WarningTypes[K];

/**
 * Parameter types for constructing a warning.
 */
export type WarningParameters<T> = T extends { new (arg0: any, ...rest: infer R): any } ? R : never;
