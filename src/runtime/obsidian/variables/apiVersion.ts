import { getEnvironment } from '#runtime';

export const apiVersion: string = getEnvironment().options.version;
