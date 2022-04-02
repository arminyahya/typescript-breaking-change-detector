import { AST, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { ASTWithContext, Context, throwValidatorError } from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import propertyValidator from "./validators/property";
import TypeAliasValidator from "./validators/typeAlias";
import { ExportNamedDeclaration, TSInterfaceDeclaration, TSModuleDeclaration, TSTypeAliasDeclaration, VariableDeclaration} from "@typescript-eslint/types/dist/generated/ast-spec";
import tsDeclareFunctionValidator from "./validators/tsDeclareFunction";
import moduleValidator from "./validators/module";
import variableValidator from "./validators/variableValidator";
import chalk from "chalk";

export default function isNewDeclarationValid(context: Context , codeA: AST<any>, codeB: AST<any>) {
  try {
    for (const declarationA of codeA.body) {
      switch (declarationA.type as keyof typeof AST_NODE_TYPES) {
        case AST_NODE_TYPES.ExportNamedDeclaration:
          throwValidatorError(
            ExportValidator(context, declarationA as ExportNamedDeclaration, codeB)
          );
          break;
        case AST_NODE_TYPES.TSInterfaceDeclaration:
          throwValidatorError(InterfaceValidator(context, declarationA as TSInterfaceDeclaration, codeB));
          break;
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
          throwValidatorError(TypeAliasValidator(context, declarationA as TSTypeAliasDeclaration, codeB));
          break;
        case AST_NODE_TYPES.TSPropertySignature:
          throwValidatorError(propertyValidator(context, declarationA, codeB));
          break;
        case AST_NODE_TYPES.FunctionDeclaration:
          throwValidatorError(tsDeclareFunctionValidator(context, declarationA, codeB));
          break;
        case AST_NODE_TYPES.TSModuleDeclaration:
          throwValidatorError(moduleValidator(context, declarationA as TSModuleDeclaration, codeB));
          break;
        case AST_NODE_TYPES.VariableDeclaration:
          throwValidatorError(variableValidator(context, declarationA as VariableDeclaration, codeB));
          break;
        default:
          break;
      }
    }
    return { isValid: true };
  } catch (e) {
    return { isValid: false, info: chalk.red(e) };
  }
}
