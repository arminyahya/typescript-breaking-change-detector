import { AST, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import {
	throwValidatorError,
} from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import propertyValidator from "./validators/property";
import TypeAliasValidator from "./validators/typeAlias";
import { TSESTreeOptions } from "@typescript-eslint/typescript-estree/dist/parser-options";
import { ExportNamedDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec'
import tsDeclareFunctionValidator from "./validators/tsDeclareFunction";

export default function compareDeclarations(codeA , codeB	) {
  for (const declarationA of codeA.body) {
    switch (declarationA.type as keyof typeof AST_NODE_TYPES) {
      case "ExportNamedDeclaration":
				throwValidatorError(ExportValidator(declarationA as ExportNamedDeclaration, codeB));
        break;
      case "TSInterfaceDeclaration":
				throwValidatorError(InterfaceValidator(declarationA, codeB));
        break;
      case "TSTypeAliasDeclaration":
				throwValidatorError(TypeAliasValidator(declarationA, codeB));
        break;
      case "TSPropertySignature":
				throwValidatorError(propertyValidator(declarationA, codeB));
        break;
			case "FunctionDeclaration": 
				throwValidatorError(tsDeclareFunctionValidator(declarationA, codeB));
				break;
      default:
        break;
    }
  }
}