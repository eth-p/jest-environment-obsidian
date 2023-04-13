import { RUNTIME_STATE_GLOBAL_NAME } from '../constants';

/**
 * Setup function that will automatically be called by Jest.
 *
 * Since this may be injected into tests that aren't using `jest-environment-obsidian`,
 * we need to make sure to only load the extensions when we're running under the environment.
 */
export = async function () {
	if (RUNTIME_STATE_GLOBAL_NAME in globalThis) {
		require('jest-environment-obsidian/test-runtime/extensions');
	}
};
