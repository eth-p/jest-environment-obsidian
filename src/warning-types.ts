import { AbstractWarning } from './warning';

export class NodeMustBeWithinDocument extends AbstractWarning {
	toString() {
		return [
			`${this.caller} will always return false unless the node is attached to the document.`,
			'In this test, the node was not attached to the document.',
			'',
			'To remove this behavior from unit tests, use the `@obsidian-api lax` test pragma.',
		].join('\n');
	}
}

export class SetCssStylesDoesNotSetVariables extends AbstractWarning {
	public readonly property: string;

	constructor(context: string, property: string) {
		super(context);
		this.property = property;
	}

	toString() {
		return [
			`${this.caller} does not change CSS variables.`,
			`To actually set \`${this.property}\` within the DOM, use \`setCssProperty\` instead.`,
			'',
			`If this in intentional, use the \`@obsidian-jest-ignore ${this.id}\` test pragma.`,
		].join('\n');
	}
}

export class SetCssStylesDoesNotSetUnknownProperties extends AbstractWarning {
	public readonly property: string;

	constructor(context: string, property: string) {
		super(context);
		this.property = property;
	}

	toString() {
		return [
			`${this.caller} does not set unknown style properties.`,
			`To actually set \`${this.property}\` within the DOM, use \`setCssProperty\` instead.`,
			'',
			`If this in intentional, use the \`@obsidian-jest-ignore ${this.id}\` test pragma.`,
		].join('\n');
	}
}

export class IllegalCssClassName extends AbstractWarning {
	public readonly property: string;
	public readonly value: string;

	constructor(context: string, property: string, value: string) {
		super(context);
		this.property = property;
		this.value = value;
	}

	toString() {
		return [
			`Property \`${this.property}\` provided to ${this.caller} contains an invalid CSS class, "${this.value}".`,
			`This will throw an error both within tests and Obsidian.`,
		].join('\n');
	}
}

export class MissingExportStub extends AbstractWarning {
	public readonly module: string;
	public readonly prop: string;

	constructor(context: string, module: string, prop: string) {
		super(context);
		this.module = module;
		this.prop = prop;
	}

	toString() {
		return [
			'jest-environment-obsidian does not have a stub for',
			`'${this.prop}' in the '${this.module}' module.`,
			'',
			`Import for '${this.prop}' will return \`undefined\`,`,
			'which may cause unexpected behaviors in your tests.',
			'',
			'Please consider opening an issue or creating a pull request for this stub at',
			'',
			'https://github.com/obsidian-community/jest-environment-obsidian',
			'',
			'Alternatively, you can emit an undefined variable without this warning',
			'(or turn it into an error) by changing the `missingExports` environment',
			'option to either "undef" or "error"',
		].join('\n');
	}
}
