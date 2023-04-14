import { BaseComponent } from './BaseComponent';

/**
 * An abstract UI component that holds a value.
 */
export abstract class ValueComponent<T> extends BaseComponent {
	public constructor() {
		super();
	}

	/**
	 * Registers a listener function that will update the value of this component if the listener provides a defined
	 * value as the first parameter.
	 *
	 * @param listeners A map of listener functions.
	 * @param key The key to add the listener function as.
	 */
	public registerOptionListener(listeners: Record<string, (value?: T) => T>, key: string): this {
		listeners[key] = (value: T | undefined) => {
			if (value !== undefined) this.setValue(value);
			return this.getValue();
		};

		return this;
	}

	public abstract getValue(): T;
	public abstract setValue(value: T): this;
}
