import { accessSync } from 'fs';
import { join } from 'path';

import { type FindNodeModuleConfig, default as JestResolve } from 'jest-resolve';

import { MOCKED_MODULE_ROOT, SOURCE_EXTENSION } from './self-paths';
import monkeypatch from './monkeypatch';

// Get the real resolver class.
// For whatever reason, the types exported for jest-resolve aren't correct.
const ResolverInstance = JestResolve.name === 'Resolver' ? JestResolve : (JestResolve as any).default;
type Resolver = typeof JestResolve;

type FindNodeModuleSync = typeof JestResolve.findNodeModule;
type FindNodeModuleAsync = typeof JestResolve.findNodeModuleAsync;

type Original<T extends FindNodeModuleSync | FindNodeModuleAsync> = (
	this: void,
	...args: [...Parameters<T>, ...unknown[]]
) => ReturnType<T>;

/**
 * Monkeypatches Jest's module resolver to swap out some modules with the stubs provided in `jest-environment-obsidian`.
 */
export function hookResolver() {
	monkeypatch(ResolverInstance, 'findNodeModule', hookedResolverSync);
	monkeypatch(ResolverInstance, 'findNodeModuleAsync', hookedResolverAsync);
}

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

	try {
		const mocked = join(MOCKED_MODULE_ROOT, `${path}${SOURCE_EXTENSION}`);
		accessSync(mocked);
		return mocked;
	} catch (ex) {
		return null;
	}
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
function hookedResolverAsync(
	original: Original<Resolver['findNodeModuleAsync']>,
	path: string,
	options: FindNodeModuleConfig,
	...args: unknown[]
): Promise<string | null> {
	return original(path, options, ...args);
}
