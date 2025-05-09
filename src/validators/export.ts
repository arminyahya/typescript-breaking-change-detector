import { EXPORT_REMOVED } from "../constants/errors";
import {  Context, getErrorInfo } from "../helper";
import {
  AST_NODE_TYPES,
  ExportNamedDeclaration,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
	ClassDeclaration,
	FunctionDeclaration,
	TSDeclareFunction,
	TSEnumDeclaration,
	ClassExpression
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { getPropertyDetailsErrorForInterface } from "./interface";
import { validateClassProperties } from "./class";
import { getFunctionDetailsError } from "./tsDeclareFunction";
import { checkAllPrevEnumMembersExist } from "./enum";
import { getPropertyDetailsErrorForTypeAlias } from "./typeAlias";
import { AST } from "@typescript-eslint/typescript-estree";

export default function ExportValidator(
	context: Context,
  exportDelarationInPrevCode: ExportNamedDeclaration,
  currentCode: AST<any>
) {
  const sameExport= sameExportInBoth(context, exportDelarationInPrevCode, currentCode);
  if (!sameExport) {
    return getErrorInfo(EXPORT_REMOVED, context.getTextForPrevSource(exportDelarationInPrevCode.declaration));
  } else {
    switch (exportDelarationInPrevCode.declaration.type as keyof typeof AST_NODE_TYPES) {
      case AST_NODE_TYPES.ClassDeclaration:
				return validateClassProperties(context,exportDelarationInPrevCode.declaration as ClassDeclaration, (sameExport as ExportNamedDeclaration).declaration as ClassDeclaration)
      case AST_NODE_TYPES.ClassExpression:
        break;
			case AST_NODE_TYPES.TSDeclareFunction:
				return getFunctionDetailsError(context, exportDelarationInPrevCode.declaration as TSDeclareFunction, (sameExport as ExportNamedDeclaration).declaration)
      case AST_NODE_TYPES.TSEnumDeclaration:
				return checkAllPrevEnumMembersExist(context, exportDelarationInPrevCode.declaration as TSEnumDeclaration, (sameExport as ExportNamedDeclaration).declaration as TSEnumDeclaration)
      case AST_NODE_TYPES.TSModuleDeclaration:
        break;
      case AST_NODE_TYPES.VariableDeclaration:
				// We already checked variable in sameExportInBoth function.
			break;
      case AST_NODE_TYPES.TSInterfaceDeclaration:
				return getPropertyDetailsErrorForInterface(
					context,
					exportDelarationInPrevCode.declaration as TSInterfaceDeclaration ,
					(sameExport as ExportNamedDeclaration).declaration as TSInterfaceDeclaration
				);
        break;
      case AST_NODE_TYPES.TSTypeAliasDeclaration:
				return getPropertyDetailsErrorForTypeAlias(
					context,
					exportDelarationInPrevCode.declaration as TSTypeAliasDeclaration ,
					(sameExport as ExportNamedDeclaration).declaration as TSTypeAliasDeclaration
				);
        break;

      default:
        break;
    }
  }
}


export type ExportDeclarationWithIdentifier =
  | ClassDeclaration
  | ClassExpression
  | FunctionDeclaration
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSInterfaceDeclaration
  | TSTypeAliasDeclaration;


export function sameExportInBoth(
	context: Context,
  exportDeclarationInPrevCode: ExportNamedDeclaration,
  currentCode: AST<any>
) {
  return currentCode.body.find((statement) => {
    if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration && statement.declaration.type === exportDeclarationInPrevCode.declaration.type) {
      if (
        exportDeclarationInPrevCode.declaration.type === AST_NODE_TYPES.VariableDeclaration
      ) {
				return context.getTextForCurrentSource((statement as ExportNamedDeclaration).declaration) === context.getTextForPrevSource(exportDeclarationInPrevCode.declaration);
      } else if (
        exportDeclarationInPrevCode.declaration.type === AST_NODE_TYPES.TSModuleDeclaration
      ) {
        // module declaration implementation is not yet complete
      } else {
        return (
          (
            exportDeclarationInPrevCode.declaration as unknown as ExportDeclarationWithIdentifier
          ).id.name ===
          (exportDeclarationInPrevCode.declaration as ExportDeclarationWithIdentifier).id.name
        );
      }
    }
  });
}