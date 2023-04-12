import { argv } from 'node:process';
import { basename, dirname, relative, sep } from 'path';

import { JestEnvironmentConfig } from '@jest/environment';
import { formatStackTrace, indentAllLines } from 'jest-message-util';

import EnvironmentOptions from './options';

const ENABLE_COLOR = argv.includes('--color') ? true : !argv.includes('--no-color');

const REGEX_STACK_TRACE_WITHIN_THIS = /\s*at .*jest-environment-obsidian.*/;
const REGEX_STACK_TRACE_EXTRACT_FILE = /\s*at (?:.(?! \())+. \((.*?)(?::(\d+)(?::(\d+))?)?\)/;

/**
 * Prints warnings collected during test execution.
 *
 * @param writer Called to print the message somewhere.
 * @param warnings The warnings to print.
 * @param options Environment options.
 * @param config Project config.
 */
export function printWarnings(
	writer: (message: string) => any,
	warnings: Set<AbstractWarning>,
	options: EnvironmentOptions,
	config: JestEnvironmentConfig,
) {
	const seenWarnings = new Set<string>();
	for (const warning of warnings) {
		const warningInstanceId = `${warning.id}:${warning.caller}`;
		if (seenWarnings.has(warningInstanceId)) continue;
		seenWarnings.add(warningInstanceId);

		printWarning(writer, warning, options, config);
	}
}

/**
 * Prints a single warning.
 *
 * @param writer Called to print the message somewhere.
 * @param warning The warning to print.
 * @param options Environment options.
 * @param config Project config.
 */
export function printWarning(
	writer: (message: string) => any,
	warning: AbstractWarning,
	options: EnvironmentOptions,
	config: JestEnvironmentConfig,
) {
	if (options.ignoreWarnings.includes(warning.id)) return;

	// Format the warning message and stack trace.
	const message = ENABLE_COLOR
		? formatWarningMessageWithColor(warning, config)
		: formatWarningMessage(warning, config);

	const traceAndFrame = formatStackTrace(warning.stack, config.projectConfig, {
		noStackTrace: false,
	});

	// Print.
	writer(`\n${message}\n${traceAndFrame}\n`);
}

function formatWarningMessage(warning: AbstractWarning, config: JestEnvironmentConfig): string {
	const badge = `WARN`;
	const suite = warning.suite === '(unknown)' ? '(unknown)' : relative(config.projectConfig.rootDir, warning.suite);
	const id = `Warning: ${warning.id}`;

	const message = indentAllLines(warning.toString());

	return `${badge} ${suite}\n${id}\n\n${message}`;
}

function formatWarningMessageWithColor(warning: AbstractWarning, config: JestEnvironmentConfig): string {
	const badge = `\x1B[1;43m WARN \x1B[m`;
	const suite = warning.suite === '(unknown)' ? '(unknown)' : relative(config.projectConfig.rootDir, warning.suite);
	const id = `\x1B[33mWarning: \x1B[1;33m${warning.id}\x1B[m`;

	const suiteDirname = `\x1B[2m${dirname(suite)}${sep}\x1B[m`;
	const suiteBasename = `\x1B[1m${basename(suite)}\x1B[m`;

	const message = indentAllLines(warning.toString())
		.split('\n')
		.map((line) => `\x1B[33m${line}\x1B[m`)
		.join('\n');

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

export class AbstractWarning {
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
