import { parse } from '@typescript-eslint/typescript-estree';
import util from 'util';

const codeA = `
export interface A {
	
}
`;
const parsedCodeA = parse(codeA);

console.log(util.inspect(parsedCodeA, false, null, true /* enable colors */))
