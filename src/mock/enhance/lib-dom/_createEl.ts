import type { Globals } from '#context';
import { getCallerName } from '#util';
import { Warning, __WARNING__ } from '#warnings';

/**
 * Reimplementation of Obsidian's createEl function.
 *
 * @param context The environment context.
 * @param tag The tag to create.
 * @param info The element info, or if it's a string, the classname.
 * @param callback A callback function.
 * @returns The created element.
 */
export function createEl<K extends keyof HTMLElementTagNameMap>(
	context: Globals,
	tag: K,
	info?: DomElementInfo | string,
	callback?: (el: HTMLElementTagNameMap[K]) => void,
): HTMLElementTagNameMap[K] {
	const el = context.document.createElement(tag) as HTMLElementTagNameMap[K];
	const opts = infoFrom(info);

	doSetClass(context, el, opts.cls);
	doSetText(context, el, opts.text);
	doSetAttributes(context, el, opts.attr);
	doSetTitle(context, el, opts.title);
	doSetValue(context, el, opts.value);
	doSetType(context, el, opts.type);
	doSetPlaceholder(context, el, opts.placeholder);
	doSetHref(context, el, opts.href);

	return finalize(el, opts, callback);
}

/**
 * Reimplementation of Obsidian's createSvg function.
 *
 * @param context The environment context.
 * @param tag The tag to create.
 * @param info The element info, or if it's a string, the classname.
 * @param callback A callback function.
 * @returns The created element.
 */
export function createSvg<K extends keyof SVGElementTagNameMap>(
	context: Globals,
	tag: K,
	info?: SvgElementInfo | string,
	callback?: (el: SVGElementTagNameMap[K]) => void,
): SVGElementTagNameMap[K] {
	const el = context.document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElementTagNameMap[K];
	const opts = infoFrom(info);

	doSetClass(context, el, opts.cls);
	doSetAttributes(context, el, opts.attr);

	return finalize(el, opts, callback);
}

export function infoFrom<I extends DomElementInfo | SvgElementInfo>(info: I | string | undefined): I {
	if (info == null) return {} as I;
	if (typeof info === 'string') return { cls: info } as I;
	return info;
}

export function doSetClass(
	context: Globals,
	el: HTMLElement | SVGElement,
	cls: (DomElementInfo | SvgElementInfo)['cls'],
): void {
	if (cls === undefined) return;
	const classes = typeof cls === 'string' ? [cls] : cls;

	for (const className of classes) {
		if (className.includes(' ')) {
			__WARNING__(context, Warning.IllegalCssClassName, getCallerName(), 'cls', className);
		}
	}

	el.classList.add(...classes);
}

export function doSetText(context: Globals, el: HTMLElement, text: DomElementInfo['text']): void {
	if (text == null) return;
	el.setText(text);
}

export function doSetAttributes(
	context: Globals,
	el: HTMLElement | SVGElement,
	attr: (DomElementInfo | SvgElementInfo)['attr'],
): void {
	if (attr == null) return;
	el.setAttrs(attr);
}

export function doSetTitle(context: Globals, el: HTMLElement, title: DomElementInfo['title']): void {
	if (title == null) return;
	el.title = title;
}

export function doSetValue(context: Globals, el: HTMLElement, value: DomElementInfo['value']): boolean {
	if (value == null) return false;

	if (
		el instanceof context.HTMLSelectElement ||
		el instanceof context.HTMLInputElement ||
		el instanceof context.HTMLOptionElement
	) {
		el.value = value;
		return true;
	}

	return false;
}

export function doSetType(context: Globals, el: HTMLElement, type: DomElementInfo['type']): boolean {
	if (type == null) return false;

	if (el instanceof context.HTMLInputElement) {
		el.type = type;
		return true;
	}

	if (el instanceof context.HTMLStyleElement) {
		el.setAttribute('type', type);
		return true;
	}

	return false;
}

export function doSetPlaceholder(
	context: Globals,
	el: HTMLElement,
	placeholder: DomElementInfo['placeholder'],
): boolean {
	if (placeholder == null) return false;

	if (el instanceof context.HTMLInputElement) {
		el.placeholder = placeholder;
		return true;
	}

	return false;
}

export function doSetHref(context: Globals, el: HTMLElement, href: DomElementInfo['href']): boolean {
	if (href == null) return false;

	if (
		el instanceof context.HTMLBaseElement ||
		el instanceof context.HTMLAnchorElement ||
		el instanceof context.HTMLLinkElement
	) {
		el.href = href;
		return true;
	}

	return false;
}

export function finalize<T extends HTMLElement | SVGElement>(
	el: T,
	info: DomElementInfo | SvgElementInfo,
	callback?: (el: T) => void,
): T {
	if (callback) {
		callback(el);
	}

	// If a parent is provided, insert it.
	const parent = info.parent;
	if (parent != null) {
		if (info.prepend) {
			parent.insertBefore(el, parent.firstChild);
		} else {
			parent.appendChild(el);
		}
	}

	// Return the element.
	return el;
}
