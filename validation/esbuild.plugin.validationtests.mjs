import { Glob } from 'glob';
import { readFile } from 'node:fs/promises';
import { cwd } from 'node:process';

/**
 * A small esbuild plugin that automatically creates imports for all
 * test files containing `@jest-environment #meta-test/validation`.
 *
 * @returns
 */
export default function validationTestsPlugin() {
	const testFilesGlob = new Glob('../src/**/*.test.{ts,tsx}', {});
	const pwd = cwd();

	return {
		name: 'jest-environment-obsidian validations',
		setup(build) {
			const imports = new Set();

			// Allow this plugin to resolve the module to a generated script.
			build.onResolve({ filter: /^#validation-tests$/ }, (args) => ({
				path: args.path,
				namespace: 'jest-environment-obsidian validations',
			}));

			build.onLoad({ filter: /.*/, namespace: 'jest-environment-obsidian validations' }, () => {
				const importStatements = Array.from(imports.values()).map((file) => `import('${file}')`);
				return {
					contents: `// Generated file.\n${importStatements.join('\n')}\n`,
					resolveDir: pwd,
					loader: 'ts',
				};
			});

			// Find the test files and filter through them.
			build.onStart(async () => {
				imports.clear();

				const promises = [];
				for await (const file of testFilesGlob) {
					promises.push(
						(async () => {
							const pragmas = await readFilePragmas(file);
							if (!pragmas.has('jest-environment')) return;
							if (pragmas.get('jest-environment').join() !== '#meta-test/validation') return;
							imports.add(file);
						})(),
					);
				}

				await Promise.all(promises);
			});
		},
	};
}

async function readFilePragmas(path) {
	const contents = await readFile(path, 'utf-8');
	const pragmas = parseTestPragmas(contents);
	return pragmas;
}

/**
 * Parses pragmas from the first docblock in the provided string.
 *
 * @param {string} contents The file contents.
 * @returns {Map<string, Array<string>>} The pragmas found.
 */
function parseTestPragmas(contents) {
	const REGEX_DOCBLOCK = /\/\*\*(?:\n\s*(.*))\*\//gms;
	const REGEX_DOCBLOCK_LINE = /\s*\*[ \t]*([^\n]+)/gm;
	const REGEX_PRAGMA = /^@([^ ]+)(?:\s*(.*))?$/m;
	const pragmas = new Map();

	// Extract the first docblock.
	const matches = REGEX_DOCBLOCK.exec(contents);
	if (matches == null) return pragmas;
	const commentText = matches[1];

	// Extract the lines in the docblock.
	const lines = [];
	REGEX_DOCBLOCK_LINE.lastIndex = 0;
	let lineMatches = null;
	while ((lineMatches = REGEX_DOCBLOCK_LINE.exec(commentText)) != null) {
		lines.push(lineMatches[1].trim());
	}

	// Extract the pragmas from the lines.
	for (const line of lines) {
		if (!line.startsWith('@')) continue;

		// Try to extract using regex.
		const pragmaMatches = REGEX_PRAGMA.exec(line);
		if (pragmaMatches == null) continue;

		// Add the pragmas to the list.
		const pragmaName = pragmaMatches[1];
		const pragmaValue = pragmaMatches[2];

		let arr = pragmas.get(pragmaName);
		if (arr == null) {
			arr = [];
			pragmas.set(pragmaName, arr);
		}

		arr.push(pragmaValue);
	}

	return pragmas;
}
