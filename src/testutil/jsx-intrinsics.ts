export declare namespace JSX {
	export type Element = any /* extends Node */;

	interface ElementAttributes {
		className?: string;
	}

	/**
	 * Attributes of intrinsic elements.
	 */
	export interface IntrinsicElements {
		div: ElementAttributes;
		span: ElementAttributes;
		button: ElementAttributes;
	}

	/**
	 * Return types of intrinsic elements.
	 */
	export interface DOMElements {
		div: HTMLDivElement;
		span: HTMLSpanElement;
		button: HTMLButtonElement;
	}
}

export type WithChildren<T> = T & {
	children: Array<any>;
};
