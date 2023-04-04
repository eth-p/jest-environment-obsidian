import builtins from 'builtin-modules';
import esbuild from 'esbuild';
import process from 'process';

const prod = process.argv[2] === 'production';
const context = await esbuild.context({
	entryPoints: ['src/main.ts'],
	outfile: 'main.js',
	bundle: true,
	format: 'cjs',
	target: 'es2020',
	logLevel: 'info',
	jsx: 'automatic',
	jsxImportSource: '#jsx',
	alias: {
		'@jest/globals': './src/joker-jest-globals.ts',
		'#jsx/jsx-runtime': '../src/testutil/jsx-runtime.ts',
	},
	external: [
		...builtins,

		'obsidian',
		'electron',
		'@codemirror/autocomplete',
		'@codemirror/collab',
		'@codemirror/commands',
		'@codemirror/language',
		'@codemirror/lint',
		'@codemirror/search',
		'@codemirror/state',
		'@codemirror/view',
		'@lezer/common',
		'@lezer/highlight',
		'@lezer/lr',
	],
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
