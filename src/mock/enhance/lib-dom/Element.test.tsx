/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import 'obsidian';

import { beforeEach, describe, expect, test } from '@jest/globals';

describe('getText', () => {
	test('single node', () => {
		const el: HTMLDivElement = <div>foo</div>;
		expect(el.getText()).toBe('foo');
	});

	test('multiple nodes', () => {
		const el: HTMLDivElement = (
			<div>
				foo
				<span>bar</span>
				<button>baz</button>
			</div>
		);

		expect(el.getText()).toBe('foobarbaz');
	});

	test('contains fragment', () => {
		const frag: HTMLDivElement = (
			<div>
				foo
				<>
					<span>bar</span>
					baz
				</>
			</div>
		);

		expect(frag.getText()).toBe('foobarbaz');
	});
});

describe('setText', () => {
	test('string', () => {
		const el: HTMLDivElement = <div>foo</div>;

		el.setText('bar');
		expect(el.textContent).toBe('bar');
	});

	test('fragment', () => {
		const el: HTMLDivElement = <div>foo</div>;

		el.setText(
			<>
				<div>foo</div>
				<span>bar</span>
				baz
			</>,
		);

		expect(el.getText()).toBe('foobarbaz');
	});
});

describe('addClass', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('none', () => {
		el.addClass();
		expect(Array.from(el.classList.values())).toStrictEqual([]);
	});

	test('single', () => {
		el.addClass('foo');
		expect(Array.from(el.classList.values())).toStrictEqual(['foo']);
	});

	test('multiple', () => {
		el.addClass('foo', 'bar');
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar']);
	});

	test('existing', () => {
		el.classList.add('cat');
		el.addClass('cat');
		expect(Array.from(el.classList.values())).toStrictEqual(['cat']);
	});
});

describe('removeClass', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div className="foo bar baz" />;
	});

	test('none', () => {
		el.removeClass();
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar', 'baz']);
	});

	test('single', () => {
		el.removeClass('bar');
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'baz']);
	});

	test('multiple', () => {
		el.removeClass('foo', 'bar');
		expect(Array.from(el.classList.values())).toStrictEqual(['baz']);
	});

	test('non-existing', () => {
		el.removeClass('cat');
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar', 'baz']);
	});
});

describe('addClasses', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('none', () => {
		el.addClasses([]);
		expect(Array.from(el.classList.values())).toStrictEqual([]);
	});

	test('single', () => {
		el.addClasses(['foo']);
		expect(Array.from(el.classList.values())).toStrictEqual(['foo']);
	});

	test('multiple', () => {
		el.addClasses(['foo', 'bar']);
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar']);
	});

	test('existing', () => {
		el.classList.add('cat');
		el.addClasses(['cat']);
		expect(Array.from(el.classList.values())).toStrictEqual(['cat']);
	});
});

describe('removeClasses', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div className="foo bar baz" />;
	});

	test('none', () => {
		el.removeClasses([]);
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar', 'baz']);
	});

	test('single', () => {
		el.removeClasses(['bar']);
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'baz']);
	});

	test('multiple', () => {
		el.removeClasses(['foo', 'bar']);
		expect(Array.from(el.classList.values())).toStrictEqual(['baz']);
	});

	test('non-existing', () => {
		el.removeClasses(['cat']);
		expect(Array.from(el.classList.values())).toStrictEqual(['foo', 'bar', 'baz']);
	});
});

describe('toggleClass', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div className="foo bar baz" />;
	});

	test('true, with string', () => {
		expect(el.classList.contains('cat')).toBe(false);

		el.toggleClass('cat', true);
		expect(el.classList.contains('cat')).toBe(true);
	});

	test('true, with string array', () => {
		expect(el.classList.contains('cat')).toBe(false);
		expect(el.classList.contains('dog')).toBe(false);

		el.toggleClass(['cat', 'dog'], true);
		expect(el.classList.contains('cat')).toBe(true);
		expect(el.classList.contains('dog')).toBe(true);
	});

	test('true, with existing', () => {
		expect(el.classList.contains('foo')).toBe(true);
		el.toggleClass('foo', true);
		expect(el.classList.contains('foo')).toBe(true);
	});

	test('false, with string', () => {
		expect(el.classList.contains('foo')).toBe(true);

		el.toggleClass('cat', false);
		expect(el.classList.contains('cat')).toBe(false);
	});

	test('false, with string array', () => {
		expect(el.classList.contains('foo')).toBe(true);
		expect(el.classList.contains('bar')).toBe(true);

		el.toggleClass(['foo', 'bar'], false);
		expect(el.classList.contains('foo')).toBe(false);
		expect(el.classList.contains('bar')).toBe(false);
	});

	test('false, with non-existing', () => {
		expect(el.classList.contains('cat')).toBe(false);
		el.toggleClass('cat', false);
		expect(el.classList.contains('cat')).toBe(false);
	});
});

describe('hasClass', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div className="foo" />;
	});

	test('does have class', () => {
		expect(el.hasClass('foo')).toBe(true);
	});

	test('does not have class', () => {
		expect(el.hasClass('cat')).toBe(false);
	});

	test('invalid class name', () => {
		expect(el.hasClass('not a valid class')).toBe(false);
	});
});

describe('setAttr', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div data-foo="bar" />;
	});

	test('set to string', () => {
		el.setAttr('data-test', 'foo');
		expect(el.getAttribute('data-test')).toBe('foo');
	});

	test('set to empty string', () => {
		el.setAttr('data-test', '');
		expect(el.getAttribute('data-test')).toBe('');
	});

	test('set to number', () => {
		el.setAttr('data-test', -1);
		expect(el.getAttribute('data-test')).toBe('-1');
	});

	test('set to null', () => {
		el.setAttr('data-foo', null);
		expect(el.getAttribute('data-foo')).toBeNull();
	});

	test('set to undefined', () => {
		// Not explicitly covered in the API, but we need to test for it.
		el.setAttr('data-foo', undefined as any);
		expect(el.getAttribute('data-foo')).toBe('undefined');
	});

	// For booleans:
	//   Seems unintutitive compared to the DOM API, but this is how Obsidian does it.
	//   e.g. `HTMLInputElement.disabled = true;` -> `setAttribute("disabled", "")`;
	test('set to true boolean', () => {
		el.setAttr('data-test', true);
		expect(el.getAttribute('data-test')).toBe('true');
	});

	test('set to false boolean', () => {
		el.setAttr('data-test', false);
		expect(el.getAttribute('data-test')).toBe('false');
	});
});

describe('setAttrs', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div data-foo="bar" />;
	});

	// Single properties.
	// Same behavior as `setAttr`.

	test('set to string', () => {
		el.setAttrs({ 'data-test': 'foo' });
		expect(el.getAttribute('data-test')).toBe('foo');
	});

	test('set to empty string', () => {
		el.setAttrs({ 'data-test': '' });
		expect(el.getAttribute('data-test')).toBe('');
	});

	test('set to number', () => {
		el.setAttrs({ 'data-test': -1 });
		expect(el.getAttribute('data-test')).toBe('-1');
	});

	test('set to null', () => {
		el.setAttrs({ 'data-foo': null });
		expect(el.getAttribute('data-foo')).toBeNull();
	});

	test('set to true boolean', () => {
		el.setAttrs({ 'data-test': true });
		expect(el.getAttribute('data-test')).toBe('true');
	});

	test('set to false boolean', () => {
		el.setAttrs({ 'data-test': false });
		expect(el.getAttribute('data-test')).toBe('false');
	});

	test('set to undefined', () => {
		el.setAttrs({ 'data-foo': undefined as any });
		expect(el.getAttribute('data-foo')).toBe('undefined');
	});

	// Special cases.

	test('ignores object prototype', () => {
		const proto = { 'data-should-not-exist': 'yes' };
		const attrs = Object.assign(Object.create(proto), {
			'data-test': 'test',
		});

		el.setAttrs(attrs);
		expect(el.getAttribute('data-test')).toBe('test');
		expect(el.getAttribute('data-should-not-exist')).toBeNull();
	});
});

describe('getAttr', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div data-foo="bar" />;
	});

	test('attribute exists', () => {
		expect(el.getAttr('data-foo')).toBe('bar');
	});

	test('attribute does not exist', () => {
		expect(el.getAttr('data-nonexistent')).toBeNull();
	});
});

describe('find', () => {
	test('simple selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		const target = el.querySelector('#target');
		expect(target).toBeDefined();
		expect(el.find('#target')).toBe(target);
	});

	test('complicated selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="parent">
					<div id="target" className="class"></div>
				</div>
			</div>
		);

		const target = el.querySelector('#target');
		expect(target).toBeDefined();
		expect(el.find('#parent > #target.class')).toBe(target);
	});

	test('no matches', () => {
		const el: HTMLDivElement = <div></div>;

		expect(el.find('#target')).toBeNull();
	});
});

describe('findAll', () => {
	test('multiple matches', () => {
		const el: HTMLDivElement = (
			<div>
				<div className="target"></div>
				<div className="target"></div>
			</div>
		);

		const target = Array.from(el.querySelectorAll('.target'));
		expect(el.findAll('.target')).toStrictEqual(target);
	});

	test('single match', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		expect(el.findAll('#target')).toStrictEqual([el.querySelector('#target')]);
	});

	test('no matches', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		expect(el.findAll('#no-target')).toStrictEqual([]);
	});

	test('complicated selector', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="parent">
					<div id="foo" className="class"></div>
					<div id="bar" className="class"></div>
				</div>
			</div>
		);

		const target = Array.from(el.querySelectorAll('.class'));
		expect(target).not.toStrictEqual([]);
		expect(el.findAll('#parent > div.class')).toStrictEqual(target);
	});
});

describe('findAllSelf', () => {
	test('multiple matches', () => {
		const el: HTMLDivElement = (
			<div className="target">
				<div className="target"></div>
				<div className="target"></div>
			</div>
		);

		expect(el.findAllSelf('.target')).toStrictEqual([el, ...el.querySelectorAll('.target')]);
	});

	test('single match', () => {
		const el: HTMLDivElement = (
			<div id="target">
				<div></div>
			</div>
		);

		expect(el.findAllSelf('#target')).toStrictEqual([el]);
	});

	test('no matches', () => {
		const el: HTMLDivElement = (
			<div>
				<div id="target"></div>
			</div>
		);

		expect(el.findAllSelf('#no-target')).toStrictEqual([]);
	});

	test('complicated selector', () => {
		const el: HTMLDivElement = (
			<div id="parent">
				<div id="foo" className="class"></div>
				<div id="bar" className="class"></div>
			</div>
		);

		const target = [el, ...el.querySelectorAll('.class')];
		expect(el.findAllSelf('div[id]')).toStrictEqual(target);
	});
});
