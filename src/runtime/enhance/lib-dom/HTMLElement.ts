// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface HTMLElement extends Element {
//         show(): void;
//         hide(): void;
//         toggle(show: boolean): void;
//         toggleVisibility(visible: boolean): void;
//         isShown(): boolean;
//         setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
//         setCssProps(props: Record<string, string>): void;
//         readonly innerWidth: number;
//         readonly innerHeight: number;
//     }
//
//     interface HTMLElement extends Element {
//         find(selector: string): HTMLElement;
//         findAll(selector: string): HTMLElement[];
//         findAllSelf(selector: string): HTMLElement[];
//     }
//
import { __UNIMPLEMENTED__, __WARNING__, getCallerName, getEnvironment } from '#runtime';

import { _find, _findAll, _findAllSelf } from './Element';

HTMLElement.prototype.show = function show(): void {
	if (this.style.getPropertyValue('display') !== 'none') {
		return;
	}

	// If there was a display property before hiding, put it back.
	const oldDisplay = this.getAttribute('data-display');
	if (oldDisplay !== null) {
		this.removeAttribute('data-display');
		this.style.setProperty('display', oldDisplay);
		return;
	}

	// If there wasn't a display property before, remove it.
	this.style.removeProperty('display');
};

HTMLElement.prototype.hide = function hide(): void {
	const oldDisplay = this.style.getPropertyValue('display');
	if (oldDisplay !== '') {
		this.setAttribute('data-display', oldDisplay);
	}

	this.style.setProperty('display', 'none');
};

HTMLElement.prototype.toggle = function toggle(show: boolean): void {
	if (show) {
		this.show();
	} else {
		this.hide();
	}
};

HTMLElement.prototype.toggleVisibility = function toggleVisibility(visible: boolean): void {
	if (visible) {
		this.style.removeProperty('visibility');
	} else {
		this.style.setProperty('visibility', 'hidden');
	}
};

HTMLElement.prototype.isShown = function isShown(): boolean {
	const options = getEnvironment().options;

	// Strict conformance.
	if (options.conformance === 'strict') {
		if (!document.contains(this)) {
			__WARNING__('NodeMustBeWithinDocument', null);
			return false;
		}
	}

	// Special cases.
	if (this instanceof HTMLHtmlElement) return false;
	if (this instanceof HTMLBodyElement) return false;

	const styles = window.getComputedStyle(this);
	let position = styles.getPropertyValue('position');
	if (position === '') position = this.style.getPropertyValue('position');
	if (position === 'fixed') return false;

	// Walk upwards, checking.
	for (let target: Element | null = this; target != null; target = target.parentElement) {
		if (!(target instanceof HTMLElement)) continue;

		const styles = window.getComputedStyle(target);
		let display = styles.getPropertyValue('display');
		if (display === '') display = this.style.getPropertyValue('display');
		if (display === 'none') return false;
	}

	return true;
};

HTMLElement.prototype.setCssStyles = function setCssStyles(styles: Partial<CSSStyleDeclaration>): void {
	_setCssStyles(this, styles);
};

HTMLElement.prototype.setCssProps = function setCssProps(props: Record<string, string>): void {
	_setCssProps(this, props);
};

Object.defineProperty(HTMLElement, 'innerWidth', {
	get: () => {
		__UNIMPLEMENTED__();
		return 0;
	},
});

Object.defineProperty(HTMLElement, 'innerHeight', {
	get: () => {
		__UNIMPLEMENTED__();
		return 0;
	},
});

HTMLElement.prototype.find = function find(selector: string): HTMLElement {
	// NOTE: Type definitions don't describe null as a return type, but
	//       testing revealed that it is a possible option.
	return _find(this, selector) as HTMLElement;
};

HTMLElement.prototype.findAll = function findAll(selector: string): HTMLElement[] {
	return _findAll(this, selector) as HTMLElement[];
};

HTMLElement.prototype.findAllSelf = function findAllSelf(selector: string): HTMLElement[] {
	return _findAllSelf(this, selector) as HTMLElement[];
};

export function _setCssStyles(target: HTMLElement | SVGElement, styles: Partial<CSSStyleDeclaration>): void {
	for (const [key, value] of Object.entries(styles)) {
		if (!(key in target.style)) {
			__WARNING__(
				key.startsWith('--') ? 'SetCssStylesDoesNotSetVariables' : 'SetCssStylesDoesNotSetUnknownProperties',
				getCallerName(),
				key,
			);
		}

		(target.style as Record<string, any>)[key] = value;
	}
}

export function _setCssProps(target: HTMLElement | SVGElement, props: Record<string, string>): void {
	for (const [key, value] of Object.entries(props)) {
		target.style.setProperty(key, value);
	}
}
