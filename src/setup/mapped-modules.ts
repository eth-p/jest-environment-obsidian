import { RUNTIME_PACKAGE } from '../constants';

/**
 * A list of modules which have shims provided.
 * @internal
 */
const MappedModules: Record<string, string> = {
	obsidian: require.resolve(`${RUNTIME_PACKAGE}/modules/obsidian`),
};

export default MappedModules;
