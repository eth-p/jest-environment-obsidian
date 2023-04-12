/**
 * Note: This test is meant to test internal functions to prevent regressions.
 * It cannot be run within the validation plugin.
 *
 * @jest-environment #meta-test/internal
 */
import { getEnvironment } from '#runtime';

import { afterEach, describe, expect, jest, test } from '@jest/globals';

import {
	doSetAttributes,
	doSetClass,
	doSetHref,
	doSetPlaceholder,
	doSetText,
	doSetTitle,
	doSetType,
	doSetValue,
	finalize,
	infoFrom,
} from './_createEl';

afterEach(() => {
	getEnvironment().warnings.clear();
});

describe('internal: infoFrom', () => {
	test('string', () => {
		expect(infoFrom('some-class')).toStrictEqual({ cls: 'some-class' });
	});

	test('undefined', () => {
		expect(infoFrom(undefined)).toStrictEqual({});
	});

	test('object', () => {
		const obj = { cls: ['foo', 'bar'] };
		expect(infoFrom(obj)).toBe(obj);
	});
});

describe('internal: doSetClass', () => {
	let el!: HTMLElement;
	beforeEach(() => {
		el = <div />;
	});

	test('string', () => {
		expect(() => doSetClass(el, 'foo')).not.toThrow();
		expect(el.classList.contains('foo')).toBe(true);
		expect(el.classList.length).toBe(1);
	});

	test('array', () => {
		expect(() => doSetClass(el, ['foo', 'bar'])).not.toThrow();
		expect(el.classList.contains('foo')).toBe(true);
		expect(el.classList.contains('bar')).toBe(true);
		expect(el.classList.length).toBe(2);
	});

	test('undefined', () => {
		expect(() => doSetClass(el, undefined)).not.toThrow();
		expect(el.classList.length).toBe(0);
	});

	test('string, invalid class name', () => {
		expect(() => doSetClass(el, 'foo bar')).toThrow();
		expect(getEnvironment().warnings.count).toBe(1);
	});

	test('array, invalid class name', () => {
		expect(() => doSetClass(el, ['foo', 'foo bar'])).toThrow();
		expect(getEnvironment().warnings.count).toBe(1);
	});
});

describe('internal: doSetText', () => {
	let el!: HTMLElement;
	beforeEach(() => {
		el = <div />;
	});

	test('string', () => {
		expect(() => doSetText(el, 'foo')).not.toThrow();
		expect(el.textContent).toBe('foo');
	});

	test('fragment', () => {
		const fragment = (
			<>
				foo
				<div>bar</div>
			</>
		);
		expect(() => doSetText(el, fragment)).not.toThrow();
		expect(el.textContent).toBe('foobar');
	});

	test('undefined', () => {
		expect(() => doSetText(el, undefined)).not.toThrow();
		expect(el.textContent).toBe('');
	});
});

describe('internal: doSetAttributes', () => {
	let el!: HTMLElement;
	beforeEach(() => {
		el = <div />;
	});

	test('empty', () => {
		expect(() => doSetAttributes(el, {})).not.toThrow();
		expect(el.getAttributeNames()).toStrictEqual([]);
	});

	test('undefined', () => {
		expect(() => doSetAttributes(el, undefined)).not.toThrow();
		expect(el.getAttributeNames()).toStrictEqual([]);
	});

	test('attributes', () => {
		expect(() =>
			doSetAttributes(el, {
				'data-foo': 'bar',
				'data-bar': 'baz',
			}),
		).not.toThrow();

		expect(el.getAttributeNames()).toStrictEqual(['data-foo', 'data-bar']);
		expect(el.getAttribute('data-foo')).toBe('bar');
		expect(el.getAttribute('data-bar')).toBe('baz');
	});
});

describe('internal: doSetTitle', () => {
	let el!: HTMLElement;
	beforeEach(() => {
		el = <div />;
	});

	test('empty', () => {
		expect(() => doSetTitle(el, '')).not.toThrow();
		expect(el.getAttribute('title')).toBe('');
	});

	test('undefined', () => {
		expect(() => doSetTitle(el, undefined)).not.toThrow();
		expect(el.getAttribute('title')).toBeNull();
	});

	test('string', () => {
		expect(() => doSetTitle(el, 'foo')).not.toThrow();
		expect(el.getAttribute('title')).toBe('foo');
	});
});

describe('internal: doSetValue', () => {
	test('ignores most tags', () => {
		const el = <div />;
		expect(doSetValue(el, 'foo')).toBe(false);
		expect(el.value).toBe(undefined);
		expect(el.getAttribute('value')).toBe(null);
	});

	test('empty', () => {
		const el = <input />;
		expect(doSetValue(el, '')).toBe(true);
		expect(el.value).toBe('');
	});

	test('undefined', () => {
		const el = <input />;
		el.value = 'bar';
		expect(doSetValue(el, undefined)).toBe(false);
		expect(el.value).toBe('bar');
	});

	test('accepts HTMLInputElement', () => {
		const el = <input />;
		expect(doSetValue(el, 'foo')).toBe(true);
		expect(el.value).toBe('foo');
	});

	test('accepts HTMLSelectElement', () => {
		const el = (
			<select>
				<option value="foo" />
			</select>
		);

		expect(doSetValue(el, 'foo')).toBe(true);
		expect(el.value).toBe('foo');
	});

	test('accepts HTMLOptionElement', () => {
		const el = <option />;
		expect(doSetValue(el, 'foo')).toBe(true);
		expect(el.value).toBe('foo');
	});
});

describe('internal: doSetType', () => {
	test('ignores most tags', () => {
		const el = <div />;
		expect(doSetType(el, 'foo')).toBe(false);
		expect(el.getAttribute('type')).toBe(null);
	});

	test('empty', () => {
		const el = <input />;
		expect(doSetType(el, '')).toBe(true);
		expect(el.getAttribute('type')).toBe('');
	});

	test('undefined', () => {
		const el = <input />;
		expect(doSetType(el, undefined)).toBe(false);
		expect(el.getAttribute('type')).toBeNull();
	});

	test('accepts HTMLInputElement', () => {
		const el = <input />;
		expect(doSetType(el, 'text')).toBe(true);
		expect(el.getAttribute('type')).toBe('text');
	});

	test('accepts HTMLStyleElement', () => {
		const el = <style />;
		expect(doSetType(el, 'text/css')).toBe(true);
		expect(el.getAttribute('type')).toBe('text/css');
	});
});

describe('internal: doSetPlaceholder', () => {
	test('ignores most tags', () => {
		const el = <div />;
		expect(doSetPlaceholder(el, 'foo')).toBe(false);
		expect(el.getAttribute('placeholder')).toBe(null);
	});

	test('empty', () => {
		const el = <input />;
		expect(doSetPlaceholder(el, '')).toBe(true);
		expect(el.getAttribute('placeholder')).toBe('');
	});

	test('undefined', () => {
		const el = <input />;
		expect(doSetPlaceholder(el, undefined)).toBe(false);
		expect(el.getAttribute('placeholder')).toBeNull();
	});

	test('accepts HTMLInputElement', () => {
		const el = <input />;
		expect(doSetPlaceholder(el, 'text')).toBe(true);
		expect(el.getAttribute('placeholder')).toBe('text');
	});
});

describe('internal: doSetHref', () => {
	test('ignores most tags', () => {
		const el = <div />;
		expect(doSetHref(el, 'foo')).toBe(false);
		expect(el.getAttribute('href')).toBe(null);
	});

	test('empty', () => {
		const el = <a />;
		expect(doSetHref(el, '')).toBe(true);
		expect(el.getAttribute('href')).toBe('');
	});

	test('undefined', () => {
		const el = <a />;
		expect(doSetHref(el, undefined)).toBe(false);
		expect(el.getAttribute('href')).toBeNull();
	});

	test('accepts HTMLInputElement', () => {
		const el = <a />;
		expect(doSetHref(el, 'about:blank')).toBe(true);
		expect(el.getAttribute('href')).toBe('about:blank');
	});

	test('accepts HTMLLinkElement', () => {
		const el = <link />;
		expect(doSetHref(el, 'about:blank')).toBe(true);
		expect(el.getAttribute('href')).toBe('about:blank');
	});

	test('accepts HTMLBaseElement', () => {
		const el = <base />;
		expect(doSetHref(el, 'about:blank')).toBe(true);
		expect(el.getAttribute('href')).toBe('about:blank');
	});
});

describe('internal: finalize', () => {
	test('appends to parent by default', () => {
		const el: HTMLElement = <div />;
		const parent = (
			<div>
				<span />
			</div>
		);

		finalize(el, { parent, prepend: false });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).not.toBeNull();
	});

	test('appends to parent', () => {
		const el: HTMLElement = <div />;
		const parent = (
			<div>
				<span />
			</div>
		);

		finalize(el, { parent });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).not.toBeNull();
	});

	test('prepends to parent', () => {
		const el: HTMLElement = <div />;
		const parent = (
			<div>
				<span />
			</div>
		);

		finalize(el, { parent, prepend: true });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).toBeNull();
	});

	test('calls callback', () => {
		const el: HTMLElement = <div />;
		const parent = <div />;

		const cb = jest.fn();
		finalize(el, { parent, prepend: true }, cb);
		expect(cb).toBeCalledWith(el);
	});

	test('calls callback before appending', () => {
		const el: HTMLElement = <div />;
		const parent = <div />;

		const cb = jest.fn(() => {
			expect(el.parentNode).toBeNull();
		});

		finalize(el, { parent, prepend: true }, cb);
		expect(cb).toBeCalledWith(el);
		expect(el.parentNode).toBe(parent);
	});
});
