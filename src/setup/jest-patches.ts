import { JestEnvironmentConfig } from '@jest/environment';
import type { FindNodeModuleConfig, default as JestResolve } from 'jest-resolve';

import { RUNTIME_PACKAGE } from '../constants';

import resolver from './jest-resolver';
import monkeypatch from './monkeypatch';

const mappedModules = resolver.mappedModules;
let resolverHooked = false;

/**
 * Injects a setup script into the Jest project.
 *
 * This is done here (as opposed to using the environment setup() function) to keep all the runtime code within
 * the test's execution context. Mixing and matching contexts (e.g. the setup context and test runtime context)
 * leads to inconsistencies and confusing development.
 *
 * @param config The environment configuration.
 */
export function injectRuntimeSetup(config: JestEnvironmentConfig): void {
	const { projectConfig } = config;
	const setupScript = require.resolve(`${RUNTIME_PACKAGE}/setup`);

	projectConfig.setupFiles.unshift(setupScript);
}

/**
 * Monkeypatches Jest's module resolver to swap out some modules with the stubs provided in `jest-environment-obsidian`.
 */
export function injectRuntimeModules(): void {
	if (resolverHooked) return;
	resolverHooked = true;

	// Get the resolver instance.
	// We will need to require it from the parent jest instance, which needs a bit of module resolution trickery.
	const ResolverInstance = require.main!.require('jest-resolve').default;
	monkeypatch(ResolverInstance, 'findNodeModule', hookedResolverSync);
	monkeypatch(ResolverInstance, 'findNodeModuleAsync', hookedResolverAsync);
}

// Get the real resolver class.
// For whatever reason, the types exported for jest-resolve aren't correct.
type Resolver = typeof JestResolve;

type FindNodeModuleSync = typeof JestResolve.findNodeModule;
type FindNodeModuleAsync = typeof JestResolve.findNodeModuleAsync;

type Original<T extends FindNodeModuleSync | FindNodeModuleAsync> = (
	this: void,
	...args: [...Parameters<T>, ...unknown[]]
) => ReturnType<T>;

/**
 * A patch for Jest's Node Module resolver.
 *
 * @param original The original resolver function.
 * @param path  The module path.
 * @param options The resolver options.
 * @param args Other arguments.
 *
 * @returns The resolved path.
 */
function hookedResolverSync(
	original: Original<Resolver['findNodeModule']>,
	path: string,
	options: FindNodeModuleConfig,
	...args: unknown[]
): string | null {
	const result = original(path, options, ...args);
	if (result != null) return result;
	if (!options.conditions?.includes('jest-environment-obsidian')) return null;

	return path in mappedModules ? mappedModules[path] : null;
}

/**
 * A patch for Jest's async Node Module resolver.
 *
 * @param original The original resolver function.
 * @param path  The module path.
 * @param options The resolver options.
 * @param args Other arguments.
 *
 * @returns The resolved path.
 */
async function hookedResolverAsync(
	original: Original<Resolver['findNodeModuleAsync']>,
	path: string,
	options: FindNodeModuleConfig,
	...args: unknown[]
): Promise<string | null> {
	const result = await original(path, options, ...args);
	if (result != null) return result;
	if (!options.conditions?.includes('jest-environment-obsidian')) return null;

	return path in mappedModules ? mappedModules[path] : null;
}
