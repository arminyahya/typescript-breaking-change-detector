import { AST, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { ASTWithContext, Context, checkAndThrowError } from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import TypeAliasValidator from "./validators/typeAlias";
import { ExportNamedDeclaration, TSInterfaceDeclaration, TSModuleDeclaration, TSTypeAliasDeclaration, VariableDeclaration} from "@typescript-eslint/types/dist/generated/ast-spec";
import moduleValidator from "./validators/module";
import variableValidator from "./validators/variableValidator";
import chalk from "chalk";

export default function isNewDeclarationValid(context: Context , prevCode: AST<any>, currentCode: AST<any>) {
  try {
    for (const declarationInPrevCode of prevCode.body) {
      switch (declarationInPrevCode.type as keyof typeof AST_NODE_TYPES) {
        case AST_NODE_TYPES.ExportNamedDeclaration:
          checkAndThrowError(
            ExportValidator(context, declarationInPrevCode as ExportNamedDeclaration, currentCode)
          );
          break;
        case AST_NODE_TYPES.TSInterfaceDeclaration:
          checkAndThrowError(InterfaceValidator(context, declarationInPrevCode as TSInterfaceDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
          checkAndThrowError(TypeAliasValidator(context, declarationInPrevCode as TSTypeAliasDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.TSModuleDeclaration:
          checkAndThrowError(moduleValidator(context, declarationInPrevCode as TSModuleDeclaration, currentCode));
          break;
        case AST_NODE_TYPES.VariableDeclaration:
          checkAndThrowError(variableValidator(context, declarationInPrevCode as VariableDeclaration, currentCode));
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
