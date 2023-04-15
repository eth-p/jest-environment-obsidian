import { __UNIMPLEMENTED__ } from '#runtime';
import type { EventRef, KeymapEventHandler } from 'obsidian';

/**
 * An application component.
 * (Not to be confused with BaseComponent, which relates to the UI.)
 *
 * This appears to be the base for plugins and views.
 */
export class Component {
	/**
	 * Undocumented variable that stores all the components added to this component.
	 * @internal
	 */
	public _children: Component[];

	/**
	 * Undocumented variable storing the loaded state of this component.
	 * @internal
	 */
	public _loaded: boolean;

	/**
	 * Undocumented variable storing the {@link register} functions to call when unloading.
	 * @internal
	 */
	public _events: Array<() => void>;

	public constructor() {
		this._events = [];
		this._children = [];
		this._loaded = false;
	}

	/**
	 * Called to load the component.
	 */
	public load(): void {
		if (this._loaded) return;
		this._loaded = true;

		// Call onload.
		this.onload();

		// Load each of the children.
		const children = this._children.slice(0);
		for (const child of children) {
			child.load();
		}
	}

	/**
	 * Called when the component is loaded.
	 * @virtual
	 */
	public onload(): void {}

	/**
	 * Called to unload the component and its children.
	 */
	public unload(): void {
		if (!this._loaded) return;
		this._loaded = false;

		// Unload the children, making sure that they're removed from
		// this component before calling their unload functions.
		while (this._children.length > 0) {
			const child = this._children.pop()!;
			child.unload();
		}

		// Call the unregister functions, making sure that they're removed from
		// this component before calling their unload functions.
		while (this._events.length > 0) {
			const unregister = this._events.pop()!;
			unregister();
		}

		// Call onunload.
		this.onunload();
	}

	/**
	 * Called when the component is unloaded.
	 * @virtual
	 */
	public onunload(): void {}

	/**
	 * Adds a child component, loading it if this component is loaded.
	 */
	public addChild<T extends Component>(component: T): T {
		this._children.push(component);
		if (this._loaded) component.load();
		return component;
	}

	/**
	 * Removes a child component, unloading it.
	 */
	public removeChild<T extends Component>(component: T): T {
		const index = this._children.indexOf(component);
		if (index === -1) return component;

		this._children.splice(index, 1);
		component.unload();
		return component;
	}

	/**
	 * Registers a callback to be called when unloading this component.
	 */
	public register(cb: () => any): void {
		this._events.push(cb);
	}

	/**
	 * Registers an event to be detached when unloading this component.
	 */
	registerEvent(eventRef: EventRef): void {
		__UNIMPLEMENTED__();
		// TODO: Find a way to get the Events object from the eventRef.
	}

	/**
	 * Registers a DOM event to be detached when unloading this component.
	 */
	public registerDomEvent<M extends WindowEventMap | DocumentEventMap | HTMLElementEventMap, K extends keyof M>(
		el: Window | Document | HTMLElement,
		type: K,
		callback: (this: HTMLElement, ev: M[K]) => any,
		options?: boolean | AddEventListenerOptions,
	): void {
		el.addEventListener(type as string, callback as any, options);
		this.register(() => {
			el.removeEventListener(type as string, callback as any, options);
		});
	}

	/**
	 * Registers an key event to be detached when unloading this component.
	 */
	public registerScopeEvent(keyHandler: KeymapEventHandler): void {
		__UNIMPLEMENTED__();
	}
	/**
	 * Registers an interval (from setInterval) to be cancelled when unloading this component.
	 */
	public registerInterval(id: number): number {
		this.register(() => {
			clearInterval(id);
		});

		return id;
	}
}
