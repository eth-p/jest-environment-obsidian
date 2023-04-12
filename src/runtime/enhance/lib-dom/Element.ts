// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Element extends Node {
//         getText(): string;
//         setText(val: string | DocumentFragment): void;
//         addClass(...classes: string[]): void;
//         addClasses(classes: string[]): void;
//         removeClass(...classes: string[]): void;
//         removeClasses(classes: string[]): void;
//         toggleClass(classes: string | string[], value: boolean): void;
//         hasClass(cls: string): boolean;
//         setAttr(qualifiedName: string, value: string | number | boolean | null): void;
//         setAttrs(obj: {
//             [key: string]: string | number | boolean | null;
//         }): void;
//         getAttr(qualifiedName: string): string | null;
//         matchParent(selector: string, lastParent?: Element): Element | null;
//         getCssPropertyValue(property: string, pseudoElement?: string): string;
//         isActiveElement(): boolean;
//     }
//
//     interface Element extends Node {
//         find(selector: string): Element | null;
//         findAll(selector: string): HTMLElement[];
//         findAllSelf(selector: string): HTMLElement[];
//     }
//
import { __UNIMPLEMENTED__ } from '#runtime';

import { _empty } from './Node';

Element.prototype.getText = function getText(): string {
	return this.textContent ?? '';
};

Element.prototype.setText = function setText(val: string | DocumentFragment): void {
	if (typeof val === 'string') {
		this.textContent = val;
		return;
	}

	_empty(this);
	this.appendChild(val);
};

Element.prototype.addClass = function addClass(...classes: string[]): void {
	this.classList.add(...classes);
};

Element.prototype.addClasses = function addClasses(classes: string[]): void {
	this.classList.add(...classes);
};

Element.prototype.removeClass = function removeClass(...classes: string[]): void {
	this.classList.remove(...classes);
};

Element.prototype.removeClasses = function removeClasses(classes: string[]): void {
	this.classList.remove(...classes);
};

Element.prototype.toggleClass = function toggleClass(classes: string | string[], value: boolean): void {
	if (typeof classes === 'string') {
		this.classList.toggle(classes, value);
		return;
	}

	for (const cls of classes) {
		this.classList.toggle(cls, value);
	}
};

Element.prototype.hasClass = function hasClass(cls: string): boolean {
	return this.classList.contains(cls);
};

Element.prototype.setAttr = function setAttr(qualifiedName: string, value: string | number | boolean | null): void {
	if (value === null) {
		this.removeAttribute(qualifiedName);
		return;
	}

	this.setAttribute(qualifiedName, `${value}`);
};

Element.prototype.setAttrs = function setAttrs(obj: { [key: string]: string | number | boolean | null }): void {
	Object.entries(obj).forEach(([name, value]) => this.setAttr(name, value));
};

Element.prototype.getAttr = function getAttr(qualifiedName: string): string | null {
	return this.getAttribute(qualifiedName);
};

Element.prototype.matchParent = function matchParent(selector: string, lastParent?: Element): Element | null {
	__UNIMPLEMENTED__();
};

Element.prototype.getCssPropertyValue = function getCssPropertyValue(property: string, pseudoElement?: string): string {
	__UNIMPLEMENTED__();
};

Element.prototype.isActiveElement = function isActiveElement(): boolean {
	__UNIMPLEMENTED__();
};

Element.prototype.find = function find(selector: string): Element | null {
	return _find(this, selector);
};

Element.prototype.findAll = function findAll(selector: string): HTMLElement[] {
	return _findAll(this, selector) as HTMLElement[];
};

Element.prototype.findAllSelf = function findAllSelf(selector: string): HTMLElement[] {
	return _findAllSelf(this, selector) as HTMLElement[];
};

type HasQuerySelector = Element | HTMLElement | Document | DocumentFragment;
type HasMatches = Extract<HasQuerySelector, { matches(selector: string): any }>;

export function _find(target: HasQuerySelector, selector: string): Element | null {
	return target.querySelector(selector);
}

export function _findAll(target: HasQuerySelector, selector: string): Element[] {
	return Array.from(target.querySelectorAll(selector));
}

export function _findAllSelf(target: HasMatches, selector: string): Element[] {
	const selfMatches: Element[] = target.matches(selector) ? [target] : [];
	const childrenMatches: Element[] = Array.from(target.querySelectorAll(selector));
	return selfMatches.concat(childrenMatches);
}
