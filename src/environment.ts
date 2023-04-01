import { createContext } from 'node:vm';

import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { TestEnvironment as JSDomEnvironment } from 'jest-environment-jsdom';

import { hookResolver } from './resolver-hook';
import { patch } from './mock/enhance';

/**
 * A Jest environment for testing Obsidian plugins.
 */
export default class ObsidianEnvironment extends JSDomEnvironment {
	public constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context);
		this.customExportConditions.push('obsidian', 'jest-environment-obsidian');
	}

	/** @override */
	public async setup() {
		await super.setup();

		patch(this.global);
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
