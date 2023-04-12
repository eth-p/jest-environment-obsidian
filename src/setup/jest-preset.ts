import { Config } from 'jest';

import { PACKAGE_NAME, RUNTIME_PACKAGE } from '../constants';

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

	return config;
}
