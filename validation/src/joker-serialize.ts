class Serializer {
	private refcounts: Map<object | symbol, number> = new Map();
	private reflabels: Map<object | symbol, string> = new Map();
	private labelIndex: number;

	public scan(obj: any) {
		if (obj == null) return;
		if (typeof obj !== 'symbol' && typeof obj !== 'object') {
			return;
		}

		const count = (this.refcounts.get(obj) ?? 0) + 1;
		this.refcounts.set(obj, count);

		// If it's the first time, recurse into it.
		if (count === 1 && typeof obj === 'object') {
			for (const [_, value] of Object.entries(obj)) {
				this.scan(value);
			}
		}
	}

	protected labelled(value: any, factory: () => string): string {
		{
			const label = this.reflabels.get(value);
			if (label !== undefined) return label;
		}

		const refs = this.refcounts.get(value) ?? 0;
		if (refs <= 1) {
			return factory();
		}

		const label = `<ref #${this.labelIndex}>`;
		this.reflabels.set(value, label);
		return `${label} ${factory()}`;
	}

	protected indent(text: string): string {
		return '    ' + text.replace(/\n/g, '\n    ');
	}

	public serialize(value: any, depth: number = 0): string {
		if (value === null) return this.serializeNull(value, depth + 1);
		if (value === undefined) return this.serializeUndefined(value, depth + 1);
		if (value instanceof Array) return this.serializeArray(value, depth + 1);
		if (typeof value === 'boolean') return this.serializeBoolean(value, depth + 1);
		if (typeof value === 'number') return this.serializeNumber(value, depth + 1);
		if (typeof value === 'string') return this.serializeString(value, depth + 1);
		if (typeof value === 'function') return this.serializeFunction(value, depth + 1);
		if (typeof value === 'symbol') return this.serializeSymbol(value, depth + 1);
		if (typeof value === 'object') return this.serializeObject(value, depth + 1);
		return JSON.stringify(value);
	}

	public serializeObject(value: object, depth: number = 0): string {
		return this.labelled(value, () => {
			const toString = value.toString;
			if (toString !== Object.prototype.toString) {
				return value.toString();
			}

			// Serialize it manually.
			const tag = value[Symbol.toStringTag] ?? Object.getPrototypeOf(value)?.constructor?.name;
			const effectiveTag = Object.getPrototypeOf(value) === Object.prototype ? '' : `${tag} `;

			if (Object.entries(value).length === 0) {
				return `${effectiveTag}{}`;
			}

			const entries = Object.entries(value)
				.map(([name, v]) => [name, this.serialize(v)])
				.map(([name, v]) => [name, this.indent(v)])
				.map(([name, v]) => `${name}: ${v}`);

			return `${effectiveTag}{\n${entries}\n}`;
		});
	}

	public serializeArray(value: Array<unknown>, depth: number = 0): string {
		return this.labelled(value, () => {
			if (value.length === 0) return '[]';
			const items = value
				.map((v) => this.serialize(v, depth + 1))
				.map((lines) => this.indent(lines))
				.join(',\n');

			return `[\n${items}\n]`;
		});
	}

	public serializeNull(value: null, depth: number = 0): string {
		return 'null';
	}

	public serializeUndefined(value: undefined, depth: number = 0): string {
		return 'undefined';
	}

	public serializeFunction(value: (...args: any[]) => any, depth: number = 0): string {
		return value.toString();
	}

	public serializeBoolean(value: boolean, depth: number = 0): string {
		return value ? 'true' : 'false';
	}

	public serializeString(value: string, depth: number = 0): string {
		return JSON.stringify(value);
	}

	public serializeNumber(value: number, depth: number = 0): string {
		if (isNaN(value)) return 'NaN';
		return `${value}`;
	}

	public serializeSymbol(value: symbol, depth: number = 0): string {
		const desc = value.description;
		if (desc == null) {
			return this.labelled(value, () => 'Symbol()');
		}

		return `Symbol(${desc})`;
	}

	public serializeBigint(value: bigint, depth: number = 0): string {
		return `${value}n`;
	}
}

export function serialize(value: any): string {
	const sz = new Serializer();
	sz.scan(value);
	return sz.serialize(value);
}
