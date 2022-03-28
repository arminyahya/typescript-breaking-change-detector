import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { throwValidatorError } from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import propertyValidator from "./validators/property";
import TypeAliasValidator from "./validators/typeAlias";
import { ExportNamedDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import tsDeclareFunctionValidator from "./validators/tsDeclareFunction";
import moduleValidator from "./validators/module";
import variableValidator from "./validators/variableValidator";
import chalk from "chalk";

export default function isNewDeclarationValid(codeA, codeB) {
  try {
    for (const declarationA of codeA.body) {
      switch (declarationA.type as keyof typeof AST_NODE_TYPES) {
        case AST_NODE_TYPES.ExportNamedDeclaration:
          throwValidatorError(
            ExportValidator(declarationA as ExportNamedDeclaration, codeB)
          );
          break;
        case AST_NODE_TYPES.TSInterfaceDeclaration:
          throwValidatorError(InterfaceValidator(declarationA, codeB));
          break;
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
          throwValidatorError(TypeAliasValidator(declarationA, codeB));
          break;
        case AST_NODE_TYPES.TSPropertySignature:
          throwValidatorError(propertyValidator(declarationA, codeB));
          break;
        case AST_NODE_TYPES.FunctionDeclaration:
          throwValidatorError(tsDeclareFunctionValidator(declarationA, codeB));
          break;
        case AST_NODE_TYPES.TSModuleDeclaration:
          throwValidatorError(moduleValidator(declarationA, codeB));
          break;
        case AST_NODE_TYPES.VariableDeclaration:
          throwValidatorError(variableValidator(declarationA, codeB));
          break;
        default:
          break;
      }
    }
		return true;
  } catch (e) {
		// eslint-disable-next-line no-console
		console.log(chalk.red(e));
		return false;
		
	}
}
