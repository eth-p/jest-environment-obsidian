import { argv, cwd, stderr } from 'node:process';
import { basename, dirname, join, relative, sep } from 'path';

import { JestEnvironmentConfig } from '@jest/environment';
import { formatStackTrace, indentAllLines } from 'jest-message-util';

import EnvironmentOptions from './environment-options';

// export const Warnings = {
// 	'node-must-be-within-document'(problem: string) {
// 		return `an element not attached to the document was provided.\n\n${problem}`;
// 	},
// };

const WARNINGS = Symbol('jest-environment-obsidian warnings');
const ENABLE_COLOR = argv.includes('--color') ? true : !argv.includes('--no-color');

const REGEX_STACK_TRACE_AT_WARNING = /^\s*at __WARNING__/;
const REGEX_STACK_TRACE_WITHIN_THIS = /\s*at .*jest-environment-obsidian.*/;
const REGEX_STACK_TRACE_EXTRACT_FUNCTION = /\s*at ((?:.(?! \())+.)/;
const REGEX_STACK_TRACE_EXTRACT_FILE = /\s*at (?:.(?! \())+. \((.*?)(?::(\d+)(?::(\d+))?)?\)/;

const shown = new Set<string>();
const pendingWarnings = new Set<AbstractWarning>();

/**
 * Adds a warning under the current test suite.
 *
 * @param context The environment context.
 * @param type The warning type.
 * @param caller The calling function.
 * @param params The warning parameters.
 */
export function __WARNING__<T extends WarningType>(
	context: typeof globalThis,
	type: T,
	caller: string | null,
	...params: WarningParameters<T>
) {
	const warnings = (context as typeof globalThis & { [WARNINGS]: Set<AbstractWarning> })[WARNINGS];
	const warningCaller =
		caller ??
		(() => {
			const stack = new Error().stack!.split('\n');
			const lineOfCaller = stack.findIndex((line) => REGEX_STACK_TRACE_AT_WARNING.test(line)) + 1;
			const traceOfCaller = stack[lineOfCaller];

			return REGEX_STACK_TRACE_EXTRACT_FUNCTION.exec(traceOfCaller)![1];
		})();

	warnings.add(Reflect.construct(type, [warningCaller, ...params]));
}

/**
 * Sets up an environment context to collect warnings.
 * @param context The context to set up.
 */
export function setupContext(context: any) {
	(context as { [WARNINGS]: Set<AbstractWarning> })[WARNINGS] = new Set();
}

/**
 * Prints warnings collected during test execution.
 *
 * @param context The context of the test environment.
 * @param options Environment options.
 * @param config Project config.
 */
export function printWarnings(
	context: any,
	options: EnvironmentOptions,
	config: JestEnvironmentConfig['projectConfig'],
) {
	const warnings = (context as { [WARNINGS]: Set<AbstractWarning> })[WARNINGS];
	const seenWarnings = new Set<string>();

	for (const warning of warnings) {
		const warningInstanceId = `${warning.id}:${warning.caller}`;
		if (options.ignoreWarnings.includes(warning.id)) continue;
		if (seenWarnings.has(warningInstanceId)) continue;
		seenWarnings.add(warningInstanceId);

		// Format the warning message and stack trace.
		const message = ENABLE_COLOR
			? formatWarningMessageWithColor(warning, config)
			: formatWarningMessage(warning, config);

		const traceAndFrame = formatStackTrace(warning.stack, config, {
			noStackTrace: false,
		});

		// Print.
		console.error(`\n${message}\n${traceAndFrame}\n`);
	}

	warnings.clear();
}

function formatWarningMessage(warning: AbstractWarning, config: JestEnvironmentConfig['projectConfig']): string {
	const badge = `WARN`;
	const suite = warning.suite === '(unknown)' ? '(unknown)' : relative(config.rootDir, warning.suite);
	const id = `Warning: ${warning.id}`;

	const message = indentAllLines(warning.toString());

	return `${badge} ${suite}\n${id}\n\n${message}`;
}

function formatWarningMessageWithColor(
	warning: AbstractWarning,
	config: JestEnvironmentConfig['projectConfig'],
): string {
	const badge = `\x1B[1;43m WARN \x1B[m`;
	const suite = warning.suite === '(unknown)' ? '(unknown)' : relative(config.rootDir, warning.suite);
	const id = `\x1B[33mWarning: \x1B[1;33m${warning.id}\x1B[m`;

	const suiteDirname = `\x1B[2m${dirname(suite)}${sep}\x1B[m`;
	const suiteBasename = `\x1B[1m${basename(suite)}\x1B[m`;

	const message = indentAllLines(warning.toString())
		.split("\n")
		.map(line => `\x1B[33m${line}\x1B[m`)
		.join("\n");

	return `${badge} ${suiteDirname}${suiteBasename}\n${id}\n\n${message}`;
}

function filterStack(stack: string): string {
	return stack
		.split('\n')
		.slice(1)
		.filter((line) => !REGEX_STACK_TRACE_WITHIN_THIS.test(line) || line.includes('.test.ts'))
		.join('\n');
}

function filterSuite(stack: string): string {
	const traceLine = stack
		.split('\n')
		.slice(1)
		.filter((line) => !REGEX_STACK_TRACE_WITHIN_THIS.test(line) || line.includes('.test.ts'))[0];

	return REGEX_STACK_TRACE_EXTRACT_FILE.exec(traceLine)?.[1] ?? '(unknown)';
}

class AbstractWarning {
	public readonly id: string;
	public readonly stack: string;
	public readonly suite: string;
	public readonly caller: string;

	constructor(context: string, ..._rest: any[]) {
		const stack = new Error().stack!;

		this.stack = filterStack(stack);
		this.suite = filterSuite(stack);
		this.caller = context;
		this.id = (Object.getPrototypeOf(this).constructor as Function).name
			.replace(/[A-Z]/g, (matches) => `-${matches[0].toLowerCase()}`)
			.replace(/^-*/, '');
	}
}

/**
 * A type for all valid warning types.
 */
export type WarningType = {
	[K in keyof typeof Warning]: (typeof Warning)[K] extends typeof AbstractWarning ? (typeof Warning)[K] : never;
}[keyof typeof Warning];

export type WarningParameters<T> = T extends { new (arg0: any, ...rest: infer R): any } ? R : never;

/**
 * A namespace of all known warning types.
 */
export namespace Warning {
	export class NodeMustBeWithinDocument extends AbstractWarning {
		toString() {
			return [
				`${this.caller} will always return false unless the node is attached to the document.`,
				"In this test, the node was not attached to the document.",
				"",
				"To remove this behavior from unit tests, use the `@obsidian-api lax` test pragma."
			].join("\n");
		}
	}
	export class SetCssStylesDoesNotSetVariables extends AbstractWarning {
		public readonly property: string;

		constructor(context: string, property: string) {
			super(context);
			this.property = property;
		}

		toString() {
			return [
				`${this.caller} does not change CSS variables.`,
				`To actually set \`${this.property}\` within the DOM, use \`setCssProperty\` instead.`,
				"",
				`If this in intentional, use the \`@obsidian-jest-ignore ${this.id}\` test pragma.`
			].join("\n");
		}
	}
	export class SetCssStylesDoesNotSetUnknownProperties extends AbstractWarning {
		public readonly property: string;

		constructor(context: string, property: string) {
			super(context);
			this.property = property;
		}

		toString() {
			return [
				`${this.caller} does not set unknown style properties.`,
				`To actually set \`${this.property}\` within the DOM, use \`setCssProperty\` instead.`,
				"",
				`If this in intentional, use the \`@obsidian-jest-ignore ${this.id}\` test pragma.`
			].join("\n");
		}
	}
}
