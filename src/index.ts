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

export default function isNewDeclarationValid(context: Context , prevCode: AST<any>, currentCode: AST<any>) {
  try {
    for (const declarationInPrevCode of prevCode.body) {
      switch (declarationInPrevCode.type as keyof typeof AST_NODE_TYPES) {
        case AST_NODE_TYPES.ExportNamedDeclaration:
          throwValidatorError(
            ExportValidator(context, declarationInPrevCode as ExportNamedDeclaration, currentCode)
          );
          break;
        case AST_NODE_TYPES.TSInterfaceDeclaration:
          throwValidatorError(InterfaceValidator(context, declarationInPrevCode as TSInterfaceDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
          throwValidatorError(TypeAliasValidator(context, declarationInPrevCode as TSTypeAliasDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.TSPropertySignature:
          throwValidatorError(propertyValidator(context, declarationInPrevCode, currentCode));
          break;
        case AST_NODE_TYPES.FunctionDeclaration:
          throwValidatorError(tsDeclareFunctionValidator(context, declarationInPrevCode, currentCode));
          break;
        case AST_NODE_TYPES.TSModuleDeclaration:
          throwValidatorError(moduleValidator(context, declarationInPrevCode as TSModuleDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.VariableDeclaration:
          throwValidatorError(variableValidator(context, declarationInPrevCode as VariableDeclaration, currentCode));
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
