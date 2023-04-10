import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { TestEnvironment as JSDomEnvironment } from 'jest-environment-jsdom';

import EnvironmentOptions, { applyJestConfig, applyJestPragmas, createDefault } from './environment-options';
import { patch } from './mock/enhance';
import { hookResolver } from './resolver-hook';
import { printWarnings, setupContext as setupWarnings } from './warnings';

/**
 * A Jest environment for testing Obsidian plugins.
 */
export default class ObsidianEnvironment extends JSDomEnvironment {
	private options: EnvironmentOptions;
	private projectConfig: JestEnvironmentConfig['projectConfig'];

	public constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context);
		this.customExportConditions.push('obsidian', 'jest-environment-obsidian');
		this.projectConfig = config.projectConfig;

		this.options = createDefault();
		applyJestConfig(this.options, config);
		applyJestPragmas(this.options, context.docblockPragmas);
	}

	/** @override */
	public async setup() {
		await super.setup();

		setupWarnings(this.global);
		patch(this.global, this.options);
	}

	/** @override */
	public async teardown() {
		printWarnings(this.global, this.options, this.projectConfig);

		await super.teardown();
	}

	/** @override */
	public getVmContext() {
		return super.getVmContext();
	}

	// async handleTestEvent(event: Circus.AsyncEvent | Circus.SyncEvent, state: Circus.State) {
	// 	if (event.name === 'setup') {

	// 	}
	// }
}

// Enable automatic shims for obsidian modules.
hookResolver();
