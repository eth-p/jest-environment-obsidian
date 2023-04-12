import builtins from 'builtin-modules';
import esbuild from 'esbuild';
import esbuildDTS from 'esbuild-plugin-dts-bundle-generator';
import { basename, dirname, extname, join, relative } from 'node:path';

import packageJson from '../package.json';

/**
 * Gets the package export conditions as esbuild entrypoints.
 * @param condition The condition to get the output path from.
 * @returns The entrypoints.
 */
function exportConditionsAsEntryPoints(condition: string): Array<{ in: string; out: string }> {
	return Object.values(packageJson.exports)
		.filter((conds) => typeof conds === 'object' && condition in conds)
		.map((conds) => {
			const inPath = conds.typescript;
			const outPath = relative('dist', conds[condition]);

			let outName = basename(outPath, extname(outPath));
			if (extname(outName) === '.d') outName = basename(outName, '.d');

			return {
				in: inPath,
				out: join(dirname(outPath), outName),
			};
		});
}

// Calculate the entry points based on the package `exports` field.
// We know these are going to be isolated, so it's safe to bundle them.

// Set up esbuild.
(async () => {
	await esbuild.build({
		entryPoints: exportConditionsAsEntryPoints('require'),
		bundle: true,
		outdir: 'dist',
		platform: 'node',
		format: 'cjs',
		target: 'es2020',
		logLevel: 'info',
		external: [
			...builtins,
			...Object.keys(packageJson.dependencies),
			'./node_modules/*',
		],
		plugins: [
			esbuildDTS({
				entryPoints: exportConditionsAsEntryPoints('types'),
			}),
		],
	});
})();
