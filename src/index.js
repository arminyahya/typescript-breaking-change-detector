import { parse } from '@typescript-eslint/typescript-estree';
import util from 'util';
import {
	exportExistInBoth,
	getSameTypeDeclaration,
	getPropertyDetailsErrorForInterface,
	getPropertyDetailsErrorForTypeAlias
} from './helper.js';

const codeA = `
 interface Person {
	name: string;
	age: number;
	getAge: () => string;
}`;
const parsedCodeA = parse(codeA);

const codeB = `
 interface Person {
	name: string;
	age: number;
	getAge: () => number;
}
`;
const parsedCodeB = parse(codeB);
console.log(util.inspect(parsedCodeB, false, null, true /* enable colors */));

for (let declarationA of parsedCodeA.body) {
	switch (declarationA.type) {
		case 'ExportNamedDeclaration':
			if (!exportExistInBoth(declarationA, parsedCodeB)) {
				throw 'export removed!'
			}
			break;
		case 'TSInterfaceDeclaration':
			const sameInterfaceInDeclarationB = getSameTypeDeclaration(declarationA, parsedCodeB);
			if (!sameInterfaceInDeclarationB) {
				throw 'interface removed!'
			}
			const propertyDetailsError = getPropertyDetailsErrorForInterface(declarationA, sameInterfaceInDeclarationB);
			if(propertyDetailsError) {
				throw propertyDetailsError;
			}
			break;
		case 'TSTypeAliasDeclaration':
			const sameMemberInDeclarationB = getSameTypeDeclaration(declarationA,parsedCodeB);
			if (!sameMemberInDeclarationB) {
				throw 'type removed!'
			}
			const propertyDetailsErrorTypeAlias = getPropertyDetailsErrorForTypeAlias(declarationA, sameMemberInDeclarationB);
			if(propertyDetailsErrorTypeAlias) {
				throw propertyDetailsErrorTypeAlias;
			}
			break;
		default:
			break;
	}
}
