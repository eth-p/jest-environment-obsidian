import { cwd, stderr } from 'node:process';
import { relative } from 'path';

import EnvironmentOptions from './environment-options';

export const Warnings = {
	'node-must-be-within-document'(problem: string) {
		return `an element not attached to the document was provided.\n\n${problem}`;
	},
};

const shown = new Set<string>();

/**
 * Prints a warning to the console.
 *
 * @param globals The context globals.
 * @param options Environment options.
 * @param warning The warning to print.
 * @param fnName The name of the function.
 * @param parameters
 */
export function printWarning<W extends keyof typeof Warnings>(
	globals: typeof globalThis,
	options: EnvironmentOptions,
	warning: W,
	fnName: string,
	...params: Parameters<(typeof Warnings)[W]>
): void {
	if (options.ignoreWarnings.includes(warning)) return;

	const key = `${warning}:${fnName}`;
	if (shown.has(key)) return;
	shown.add(key);

	// Format the warning text.
	let text = `In the function ${fnName}, ${Warnings[warning].apply(null, params)}\n`;
	const buffer = [];
	const wrap = stderr.columns - 3;

	for (let line of text.split('\n')) {
		while (line.length > stderr.columns) {
			buffer.push(line.substring(0, wrap));
			line = line.substring(stderr.columns);
		}

		buffer.push(line);
	}

	// Print the warning.
	const badge = '\x1B[1;43m WARN \x1B[m';
	console.warn(`${badge} \x1B[33m${warning}\x1B[m \x1B[2min\x1B[m jest-environment-obsidian\x1B[2m.\x1B[m`);
	console.warn('\n  ' + buffer.join('\n  '));

	// Print the file and line number of the warning.
	const trace = new Error().stack?.split('\n')[3];
	const loc = /\(([^)]+)\)$/g.exec(trace ?? '');
	if (loc != null) {
		const matches = /(.*?)(?:(:[\d]+(?::[\d]+)))?$/.exec(loc[1]);
		const posString =
			matches == null ? loc[1] : `\x1B[36m${relative(cwd(), matches[1])}\x1B[0;2m${matches[2] ?? ''}\x1B[0m`;
		console.warn(`\x1B[2m  at \x1B[m${posString}\n`);
	}
}
