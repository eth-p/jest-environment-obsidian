import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import { TestEnvironment as JSDomEnvironment } from 'jest-environment-jsdom';

import { RUNTIME_STATE_GLOBAL_NAME } from '../constants';
import RuntimeGateway from '../gateway';
import EnvironmentOptions, { applyJestConfig, applyJestPragmas, createDefault } from '../options';

import { injectRuntimeModules, injectRuntimeSetup } from './jest-patches';

/**
 * A Jest environment for testing Obsidian plugins.
 */
export default class ObsidianEnvironment extends JSDomEnvironment {
	#envConfig: JestEnvironmentConfig;
	#envContext: EnvironmentContext;

	private options: EnvironmentOptions;
	private runtimeState: RuntimeGateway;

	public constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context);
		this.#envConfig = config;
		this.#envContext = context;

		// Add a custom export condition.
		// This is mainly used by the module resolver hook, but it can be used by packages to provide shims.
		this.customExportConditions.push('obsidian', 'jest-environment-obsidian');

		// Parse environment config and pragmas into environment options.
		this.options = createDefault();
		applyJestConfig(this.options, config);
		applyJestPragmas(this.options, context.docblockPragmas);

		// Create the shared runtime state variable and attach it to the context globals.
		this.runtimeState = new RuntimeGateway(this.options);
		this.global[RUNTIME_STATE_GLOBAL_NAME] = this.runtimeState;

		// Inject setup code into Jest.
		if (!this.options['$$JEST_ENVIRONMENT_OBSIDIAN_NO_PATCH$$']) {
			injectRuntimeSetup(this.#envConfig); // Prototype extensions and globals.
			injectRuntimeModules(); //           // Obsidian module
		}
	}

	/** @override */
	public async setup() {
		await super.setup();
	}

	/** @override */
	public async teardown() {
		this.runtimeState.warnings.print((msg) => console.error(msg), this.options, this.#envConfig);

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
