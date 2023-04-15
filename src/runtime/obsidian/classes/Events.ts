import type { EventRef } from 'obsidian';

export const _RefName = Symbol('name');
export const _RefContext = Symbol('context');
export const _RefCallback = Symbol('callback');
export const _RefTarget = Symbol('target');

export class _EventRef implements EventRef {
	public [_RefName]: string;
	public [_RefCallback]: (...data: any) => any;
	public [_RefContext]: any;
	public [_RefTarget]: Events;

	public constructor(name: string, callback: (...data: any) => any, ctx: any, target: Events) {
		this[_RefName] = name;
		this[_RefCallback] = callback;
		this[_RefTarget] = target;
		this[_RefContext] = ctx;
	}
}

/**
 * @public
 */
export class Events {
	/**
	 * Undocumented variable that stores all the listeners.
	 * @internal
	 */
	protected _: Record<string, EventRef[]>;

	public constructor() {
		this._ = {};
	}

	/**
	 * Adds an event listener.
	 */
	public on(name: string, callback: (...data: any) => any, ctx?: any): EventRef {
		if (this._[name] == null) {
			this._[name] = [];
		}

		const ref = new _EventRef(name, callback, ctx, this);
		this._[name].push(ref);
		return ref;
	}

	/**
	 * Removes an event listener.
	 * This will create a new array, rather than removing an item from the array.
	 */
	public off(name: string, callback: (...data: any) => any): void {
		removeListener(this._, name, callback, undefined);
	}

	/**
	 * Removes an event listener by its ref.
	 * This will create a new array, rather than removing an item from the array.
	 */
	public offref(ref: EventRef): void {
		const name = (ref as _EventRef)[_RefName];
		const callback = (ref as _EventRef)[_RefCallback];
		removeListener(this._, name, callback, ref);
	}

	/**
	 * Triggers an event.
	 */
	public trigger(name: string, ...data: any[]): void {
		for (const ref of this._[name] ?? []) {
			this.tryTrigger(ref, data);
		}
	}

	/**
	 * Triggers an event, ignoring an error (and deferring it to the browser's default error handler).
	 */
	public tryTrigger(evt: EventRef, args: any[]): void {
		const fn = (evt as _EventRef)[_RefCallback];
		const ctx = (evt as _EventRef)[_RefContext];

		try {
			fn.apply(ctx, args);
		} catch (ex) {
			setTimeout(() => {
				throw ex;
			}, 0);
		}
	}
}

function removeListener(
	events: Record<string, EventRef[]>,
	name: string,
	listener: (...data: any) => any,
	sourceRef: undefined | EventRef,
) {
	if (events[name] == null) return;

	// Create a new array without the listener.
	const newRefs = [];
	for (const ref of events[name]) {
		if (sourceRef == null && (ref as _EventRef)[_RefCallback] === listener) continue;
		if (sourceRef === ref) continue;
		newRefs.push(ref);
	}

	// If there are no listeners, delete the array.
	if (newRefs.length == 0) {
		delete events[name];
		return;
	}

	// Otherwise, replace it.
	events[name] = newRefs;
}
