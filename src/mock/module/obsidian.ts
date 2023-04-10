import { getOptionsWithinContext } from '#context';
import { __UNIMPLEMENTED__ } from '#util';
import { normalize } from 'node:path';
import type {
	BlockSubpathResult,
	CachedMetadata,
	HeadingSubpathResult,
	PreparedQuery,
	ReferenceCache,
	RequestUrlParam,
	RequestUrlResponsePromise,
	SearchMatches,
	SearchResult,
	SearchResultContainer,
} from 'obsidian';

export const apiVersion: string = getOptionsWithinContext().version;

export function getBlobArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	return blob.arrayBuffer();
}

export function hexToArrayBuffer(hex: string): ArrayBuffer {
	const length = hex.length / 2;

	const array = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		array[i] = parseInt(hex.substring(i * 2, i * 2 + 1), 16);
	}

	return array.buffer;
}

export function iterateRefs(refs: ReferenceCache[], cb: (ref: ReferenceCache) => boolean | void): boolean {
	let result = false;
	for (const ref of refs) {
		if (cb(ref)) result = true;
	}
	return result;
}

export function normalizePath(path: string): string {
	return normalize(path);
}

export const Platform = {
	isDesktop: true,
	isMobile: false,
	isDesktopApp: true,
	isMobileApp: false,
	isIosApp: false,
	isAndroidApp: false,
	isMacOS: false,
	isSafari: false,
};

// TODO:

export const livePreviewState: unknown = null;
export const moment_2: unknown = null;
export { moment_2 as moment };

export function finishRenderMath(): Promise<void> {
	__UNIMPLEMENTED__();
}

export function getAllTags(cache: CachedMetadata): string[] | null {
	return __UNIMPLEMENTED__();
}

export function getLinkpath(linktext: string): string {
	__UNIMPLEMENTED__();
}

export function htmlToMarkdown(html: string): string {
	__UNIMPLEMENTED__();
}

export function loadMathJax(): Promise<void> {
	__UNIMPLEMENTED__();
}

export function loadMermaid(): Promise<any> {
	__UNIMPLEMENTED__();
}

export function loadPdfJs(): Promise<any> {
	__UNIMPLEMENTED__();
}

export function loadPrism(): Promise<any> {
	__UNIMPLEMENTED__();
}

export function parseFrontMatterAliases(frontmatter: any | null): string[] | null {
	__UNIMPLEMENTED__();
}

export function parseFrontMatterEntry(frontmatter: any | null, key: string | RegExp): any | null {
	__UNIMPLEMENTED__();
}

export function parseFrontMatterStringArray(
	frontmatter: any | null,
	key: string | RegExp,
	nospaces?: boolean,
): string[] | null {
	__UNIMPLEMENTED__();
}

export function parseFrontMatterTags(frontmatter: any | null): string[] | null {
	__UNIMPLEMENTED__();
}

export function parseLinktext(linktext: string): {
	path: string;
	subpath: string;
} {
	__UNIMPLEMENTED__();
}

export function parseYaml(yaml: string): any {
	__UNIMPLEMENTED__();
}

export function prepareFuzzySearch(query: string): (text: string) => SearchResult | null {
	__UNIMPLEMENTED__();
}

export function prepareQuery(query: string): PreparedQuery {
	__UNIMPLEMENTED__();
}

export function prepareSimpleSearch(query: string): (text: string) => SearchResult | null {
	__UNIMPLEMENTED__();
}

export function getIcon(iconId: string): SVGSVGElement | null {
	__UNIMPLEMENTED__();
}

export function getIconIds(): string[] {
	__UNIMPLEMENTED__();
}

export function addIcon(iconId: string, svgContent: string): void {
	__UNIMPLEMENTED__();
}

export function removeIcon(iconId: string): void {
	__UNIMPLEMENTED__();
}

export function renderMatches(
	el: HTMLElement | DocumentFragment,
	text: string,
	matches: SearchMatches | null,
	offset?: number,
): void {
	__UNIMPLEMENTED__();
}

export function renderMath(source: string, display: boolean): HTMLElement {
	__UNIMPLEMENTED__();
}

export function renderResults(el: HTMLElement, text: string, result: SearchResult, offset?: number): void {
	__UNIMPLEMENTED__();
}

export function request(request: RequestUrlParam | string): Promise<string> {
	__UNIMPLEMENTED__();
}

export function requestUrl(request: RequestUrlParam | string): RequestUrlResponsePromise {
	__UNIMPLEMENTED__();
}

export function resolveSubpath(cache: CachedMetadata, subpath: string): HeadingSubpathResult | BlockSubpathResult {
	__UNIMPLEMENTED__();
}

export function sanitizeHTMLToDom(html: string): DocumentFragment {
	__UNIMPLEMENTED__();
}

export function setIcon(parent: HTMLElement, iconId: string): void {
	__UNIMPLEMENTED__();
}

export function sortSearchResults(results: SearchResultContainer[]): void {
	__UNIMPLEMENTED__();
}

export function stringifyYaml(obj: any): string {
	__UNIMPLEMENTED__();
}

export function stripHeading(heading: string): string {
	__UNIMPLEMENTED__();
}

export function stripHeadingForLink(heading: string): string {
	__UNIMPLEMENTED__();
}
