/**
 * Base class for UI components.
 */
export abstract class BaseComponent {
	public disabled: boolean;

	public constructor() {
		this.disabled = false;
	}

	public setDisabled(disabled: boolean): this {
		this.disabled = disabled;
		return this;
	}

	public then(cb: (component: this) => any): this {
		cb(this);
		return this;
	}
}
