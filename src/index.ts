import { parse } from "@typescript-eslint/typescript-estree";
import util from "util";
import {
	throwValidatorError,
} from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import propertyValidator from "./validators/property";
import TypeAliasValidator from "./validators/typeAlias";

const codeA = `
 export interface Person {
	name: string;
	age: number;
	getAge: () => string;
}`;
const parsedCodeA = parse(codeA);

const codeB = `
 export interface Person {
	name: string;
	age: number;
	getAge: () => number;
}
`;
const parsedCodeB = parse(codeB);
console.log(util.inspect(parsedCodeB, false, null, true /* enable colors */));

export function checkBodyOfDeclaration(codeA, codeB) {
  for (const declarationA of codeA.body) {
    switch (declarationA.type) {
      case "ExportNamedDeclaration":
				throwValidatorError(ExportValidator(declarationA, codeB));
        break;
      case "TSInterfaceDeclaration":
				throwValidatorError(InterfaceValidator(declarationA, codeB));
        break;
      case "TSTypeAliasDeclaration":
				throwValidatorError(TypeAliasValidator(declarationA, codeB))
        break;
      case "TSPropertySignature":
				throwValidatorError(propertyValidator(declarationA, codeB))
        break;
      default:
        break;
    }
  }
}
checkBodyOfDeclaration(parsedCodeA, parsedCodeB);
