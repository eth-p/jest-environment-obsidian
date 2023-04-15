import { __UNIMPLEMENTED__ } from '#runtime';
import type { App, CloseableComponent, Scope } from 'obsidian';

export class Modal implements CloseableComponent {
	public app!: App;
	public scope!: Scope;

	public containerEl!: HTMLElement;
	public modalEl!: HTMLElement;
	public titleEl!: HTMLElement;
	public contentEl!: HTMLElement;

	public shouldRestoreSelection!: boolean;

	public constructor(app: App) {
		this.app = app;
		__UNIMPLEMENTED__();
	}

	public open(): void {
		__UNIMPLEMENTED__();
	}

	public close(): void {
		__UNIMPLEMENTED__();
	}

	/**
	 * @virtual
	 */
	public onOpen(): void {}

	/**
	 * @virtual
	 */
	public onClose(): void {}
}
