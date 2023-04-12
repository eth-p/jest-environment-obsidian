import EnvironmentOptions from './options';
import { WarningCollection } from './warning-collection';

export default class RuntimeGateway {
	public readonly options: EnvironmentOptions;
	public readonly warnings: WarningCollection;

	public constructor(options: EnvironmentOptions) {
		this.options = options;
		this.warnings = new WarningCollection();
	}
}
