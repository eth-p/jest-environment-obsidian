import type JSDOMEnvironment from 'jest-environment-jsdom';

type JSDOMGlobals = JSDOMEnvironment['global'];
export type Globals = JSDOMGlobals & {};
