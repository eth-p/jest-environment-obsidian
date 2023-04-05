import { createContext } from 'node:vm';

import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { TestEnvironment as JSDomEnvironment } from 'jest-environment-jsdom';

import EnvironmentOptions from './environment-options';
import { patch } from './mock/enhance';
import { hookResolver } from './resolver-hook';

/**
 * A Jest environment for testing Obsidian plugins.
 */
export default class ObsidianEnvironment extends JSDomEnvironment {
	private options: EnvironmentOptions;

	public constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context);
		this.customExportConditions.push('obsidian', 'jest-environment-obsidian');

		this.options = {
			conformance: 'lax',
			...(config.projectConfig.testEnvironmentOptions as unknown as Partial<EnvironmentOptions>),
		};

		if (context.docblockPragmas['obsidian-conformance']) {
			this.options.conformance = context.docblockPragmas['obsidian-conformance'].toString() as any;
		}
	}

	/** @override */
	public async setup() {
		await super.setup();

		patch(this.global, this.options);
	}

	/** @override */
	public async teardown() {
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

/**
 * Global variables under `jest-environment-obsidian`.
 */
export interface Globals extends Window {
	app: unknown;
}

// Enable automatic shims for obsidian modules.
hookResolver();
