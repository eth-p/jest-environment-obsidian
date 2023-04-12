import type { JestResolver, ResolverOptions, SyncResolver } from 'jest-resolve';
import { AsyncResolver } from 'jest-resolve';

import { RUNTIME_PACKAGE } from '../constants';

/**
 * A list of modules which have shims provided.
 * @internal
 */
const mappedModules: Record<string, string> = {
	obsidian: require.resolve(`${RUNTIME_PACKAGE}/modules/obsidian`),
};

/**
 * Creates a resolver that resolves the `obsidian` package into a stub.
 *
 * @param parent If provided, this will be the default resolver used.
 * @returns A Jest resolver.
 */
function createResolver(parent?: JestResolver): JestResolver {
	const parentAsync: AsyncResolver | undefined = parent?.async;
	const parentSync: SyncResolver | undefined =
		parent?.sync ?? typeof parent === 'function' ? (parent as unknown as SyncResolver) : undefined;

	let asyncResolve: AsyncResolver | null = null;
	if (parentAsync != null) {
		asyncResolve = async function async(path: string, options: ResolverOptions): Promise<string> {
			if (path in mappedModules) return mappedModules[path];
			if (parentSync != null) return (parentAsync ?? parentSync)(path, options);
			return options.defaultResolver(path, options);
		};
	}

	return {
		sync(path: string, options: ResolverOptions): string {
			if (path in mappedModules) return mappedModules[path];
			if (parentSync != null) return parentSync(path, options);
			return options.defaultResolver(path, options);
		},

		...(asyncResolve == null ? {} : { async: asyncResolve }),
	};
}

const defaultResolver = createResolver();
export = Object.assign(
	defaultResolver as typeof defaultResolver & {
		default: ReturnType<typeof createResolver>;
		createResolver: typeof createResolver;
		mappedModules: typeof mappedModules;
	},
	{
		default: defaultResolver,
		createResolver,
		mappedModules,
	},
);
