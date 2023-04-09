import { dirname, extname, join } from 'path';

/**
 * The root directory for `jest-environment-obsidian` scripts.
 */
export const SOURCE_ROOT = dirname(new URL(import.meta.url).pathname);

/**
 * The file extension used for `jest-environment-obsidian` scripts.
 * This will be different depending on whether running from `ts-node`, as an ESModule, or as a CommonJS module.
 */
export const SOURCE_EXTENSION = extname(new URL(import.meta.url).pathname);

/**
 * The root directory for mocked/shimmed modules.
 */
export const MOCKED_MODULE_ROOT = join(SOURCE_ROOT, 'mock', 'module');
