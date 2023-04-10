import { resetStateWithinContext } from '#context';

/**
 * When called, the global state of the mocked Obsidian be purged.
 * This will reset the environment to a clean slate, preventing one test from affecting other tests.
 *
 * **Example usage:**
 * ```typescript
 * import { beforeEach } from "@jest/globals";
 * import { resetObsidian } from "jest-environment-obsidian/hooks";
 *
 * beforeEach(resetObsidian);
 * ```
 */
export function resetObsidian(): void {
	resetStateWithinContext();
}
