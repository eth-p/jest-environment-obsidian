import { JestEnvironmentConfig } from '@jest/environment';

import { LATEST_OBSIDIAN_VERSION } from './constants';

/**
 * Options for the `jest-environment-obsidian` environment.
 */
export default interface EnvironmentOptions {
	conformance: 'lax' | 'strict';
	version: string;

	ignoreWarnings: string[];

	$$JEST_ENVIRONMENT_OBSIDIAN_NO_PATCH$$?: boolean;
}

/**
 * Creates the set of default options.
 * @returns The default options.
 */
export function createDefault(): EnvironmentOptions {
	return {
		conformance: 'lax',
		version: LATEST_OBSIDIAN_VERSION,
		ignoreWarnings: [],
	};
}

/**
 * Applies environment options from the jest environment config.
 * @param target The object to modify.
 * @param config The config to read.
 */
export function applyJestConfig(target: EnvironmentOptions, config: JestEnvironmentConfig) {
	for (const [name, value] of Object.entries(config.projectConfig.testEnvironmentOptions)) {
		if (!(name in Appliers)) {
			if (IntrinsicOptions.has(name)) {
				continue;
			}

			throw new EnvironmentOptionError(name, false, 'is not a known option');
		}

		try {
			const applier = Appliers[name as keyof typeof Appliers];
			applier!.assign(target, value);
		} catch (error) {
			if (error instanceof EnvironmentOptionError) throw error;
			throw new EnvironmentOptionError(name, false, (error as Error).message);
		}
	}
}

/**
 * Applies environment options from a test file's pragma.
 *
 * @param target The object to modify.
 * @param config The pragmas to process.
 */
export function applyJestPragmas(target: EnvironmentOptions, pragmas: Record<string, string | string[]>) {
	const byPragma = new Map<string, EnvironmentOptionAppliers[keyof typeof Appliers]>();
	for (const [_, applier] of Object.entries(Appliers)) {
		if ('pragma' in applier) byPragma.set(applier.pragma!, applier);
	}

	for (const [name, value] of Object.entries(pragmas)) {
		const applier = byPragma.get(name);
		if (applier == null) continue;

		const translatedValue = applier.pragmaToConfig!(value instanceof Array ? value : [value]);

		try {
			applier.assign(target, translatedValue);
		} catch (error) {
			if (error instanceof EnvironmentOptionError) throw error;
			throw new EnvironmentOptionError(`@${name}`, true, (error as Error).message);
		}
	}
}

class EnvironmentOptionError extends Error {
	public readonly option: string;
	constructor(option: string, optionIsPragma: boolean, message: string) {
		super(
			`Failed to set up jest-environment-obsidian.\n${
				optionIsPragma ? 'The docblock pragma' : 'The environment option'
			} "${option}" ${message}`,
		);
		this.option = option;
		this.stack = '';
	}
}

type EnvironmentOptionAppliers = {
	[K in keyof EnvironmentOptions]: {
		assign(target: EnvironmentOptions, value: any): void;

		pragma?: string;
		pragmaToConfig?(value: string[]): any;
	};
};

/**
 * Intrinsic options.
 *
 * These are options that exist under `jest-environment-jsdom` that we want to leave alone.
 */
const IntrinsicOptions = new Set(['customExportConditions']);

/**
 * Option appliers.
 *
 * These functions validate and parse environment options.
 * Mapping docblock pragmas to options also happens here.
 */
const Appliers: EnvironmentOptionAppliers = {
	conformance: {
		assign(target, value) {
			if (typeof value !== 'string') throw new Error(`must be either "strict" or "lax"`);
			if (value !== 'lax' && value !== 'strict') throw new Error(`must be either "strict" or "lax"`);
			target.conformance = value;
		},

		pragma: 'obsidian-conformance',
		pragmaToConfig(value) {
			if (value.length > 1) throw new Error(`can only be specified once`);
			return value[0];
		},
	},

	version: {
		assign(target, value) {
			if (typeof value !== 'string') throw new Error('must be a string');
			target.version = value;
		},

		pragma: 'obsidian-version',
		pragmaToConfig(value) {
			if (value.length > 1) throw new Error(`can only be specified once`);
			return value[0];
		},
	},

	ignoreWarnings: {
		assign(target, value) {
			if (!(value instanceof Array)) throw new Error(`must be an array`);
			for (const item in value) if (typeof item !== 'string') throw new Error(`may only contain strings`);
			target.ignoreWarnings.push(...value);
		},

		pragma: 'obsidian-jest-ignore',
		pragmaToConfig(value) {
			return value;
		},
	},

	$$JEST_ENVIRONMENT_OBSIDIAN_NO_PATCH$$: {
		assign(target, value) {
			target['$$JEST_ENVIRONMENT_OBSIDIAN_NO_PATCH$$'] = value;
		},
	},
};
