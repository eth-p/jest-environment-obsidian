import { execFileSync } from 'child_process';
import { dirname, join } from 'path';
import { argv, argv0, env, exit } from 'process';

const ci = env.CI === true;

// Set up variables.
const args = argv.slice(2);
const here = dirname(dirname(new URL(import.meta.url).pathname));
const bin = join(here, 'node_modules', '.bin');

const binTsNode = join(bin, 'ts-node-esm');
const binJest = join(bin, 'jest');

// Set up child process environment.
const childEnv = {};
const childNodeFlags = [];
const childTsNodeFlags = ['--emit', '--experimentalSpecifierResolution', 'node'];

// Set a loader condition so that we prioritize TypeScript.
childNodeFlags.push('-C', 'typescript');

// If not inside a CI runner, use SWC for faster testing.
if (!ci) childTsNodeFlags.push('--swc');

// Spawn jest using ts-node-esm.
try {
	execFileSync(argv0, [...childNodeFlags, binTsNode, ...childTsNodeFlags, '--', binJest, ...args], {
		stdio: 'inherit',
		env: {
			...env,
			...childEnv,
			NODE_OPTIONS: childNodeFlags.join(" "),
		},
	});
} catch (ex) {
	exit(ex.status);
}
