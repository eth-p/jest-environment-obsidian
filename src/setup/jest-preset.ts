import { Config } from 'jest';

import { PACKAGE_NAME, RUNTIME_PACKAGE } from '../constants';

import MappedModules from './mapped-modules';

/**
 * The necessary configuration values for `jest-environment-obsidian` to work.
 */
const preset: Config = {
	testEnvironment: PACKAGE_NAME,
	testEnvironmentOptions: {
		$$JEST_ENVIRONMENT_OBSIDIAN_NO_PATCH$$: true,
	},
	moduleNameMapper: {},
	setupFiles: [require.resolve(`${RUNTIME_PACKAGE}/setup`)],
	resolver: `${PACKAGE_NAME}/resolver`,
};

export default preset;

/**
 * Extends a jest configuration object with `jest-environment-obsidian`'s configuration.
 *
 * @param config The config to extend.
 * @returns The extended config.
 */
export function extend<T extends Partial<Config>>(config: T): T {
	if (config.setupFiles == null) config.setupFiles = [];
	if (config.moduleNameMapper == null) config.moduleNameMapper = {};
	if (config.testEnvironmentOptions == null) config.testEnvironmentOptions = {};

	config.setupFiles.unshift(...preset.setupFiles!);
	config.testEnvironment = preset.testEnvironment;
	Object.assign(config.moduleNameMapper, preset.moduleNameMapper);
	Object.assign(config.testEnvironmentOptions, preset.testEnvironmentOptions);

	// Add the resolver.
	if (!('resolver' in config)) {
		config.resolver = 'jest-environment-obsidian/resolver';
	} else {
		// There is already a resolver.
		// Fall back to using the module name mapper.
		for (const moduleName of Object.keys(MappedModules)) {
			if (moduleName in config.moduleNameMapper) continue;
			config.moduleNameMapper[moduleName] = MappedModules[moduleName];
		}
	}

	return config;
}
