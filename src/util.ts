/**
 * Gets the name of the caller function.
 * @returns The caller function name, or null if it cannot be determined.
 */
export function getCallerName(offset?: number): string | null {
	const stack = new Error().stack ?? '';

	const REGEX_STACK_TRACE_EXTRACT_FUNCTION = /\s*at ((?:.(?! \())+.)/;
	const REGEX_STACK_TRACE_CURRENT_FUNCTION = /^\s*at getCallerName/;

	const lines = stack.split('\n');
	const index = lines.findIndex((line) => REGEX_STACK_TRACE_CURRENT_FUNCTION.test(line)) + 2 + (offset ?? 0);

	return REGEX_STACK_TRACE_EXTRACT_FUNCTION.exec(lines[index])?.[1] ?? null;
}
