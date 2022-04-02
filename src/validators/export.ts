import hasDeclarationBreakingChange from "..";
import { EXPORT_REMOVED } from "../constants/errors";
import {  Context, getErrorInfo, throwValidatorError } from "../helper";
import {
  AST_NODE_TYPES,
  ExportNamedDeclaration,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
	ClassDeclaration,
	FunctionDeclaration,
	VariableDeclaration,
	TSDeclareFunction,
	TSEnumDeclaration,
	ClassExpression
} from "@typescript-eslint/types/dist/generated/ast-spec";
import InterfaceValidator, { getPropertyDetailsErrorForInterface } from "./interface";
import classValidator, { getClassPropertyDetailError } from "./class";
import { getFunctionDetailsError } from "./tsDeclareFunction";
import { getVariableDetailError } from "./variableValidator";
import { checkAllPrevEnumMembersExist } from "./enum";
import { getPropertyDetailsErrorForTypeAlias } from "./typeAlias";
import { AST } from "@typescript-eslint/typescript-estree";

export default function ExportValidator(
	context: Context,
  exportA: ExportNamedDeclaration,
  codeB: AST<any>
) {
  const sameExport= sameExportInBoth(context, exportA, codeB);
  if (!sameExport) {
    return getErrorInfo(EXPORT_REMOVED, context.getTextForPrevSource(exportA.declaration));
  } else {
    switch (exportA.declaration.type as keyof typeof AST_NODE_TYPES) {
      case AST_NODE_TYPES.ClassDeclaration:
				return getClassPropertyDetailError(context,exportA.declaration as ClassDeclaration, (sameExport as ExportNamedDeclaration).declaration as ClassDeclaration)
      case AST_NODE_TYPES.ClassExpression:
        break;
			case AST_NODE_TYPES.TSDeclareFunction:
				return getFunctionDetailsError(context, exportA.declaration as TSDeclareFunction, (sameExport as ExportNamedDeclaration).declaration)
      case AST_NODE_TYPES.TSEnumDeclaration:
				return checkAllPrevEnumMembersExist(context, exportA.declaration as TSEnumDeclaration, (sameExport as ExportNamedDeclaration).declaration as TSEnumDeclaration)
      case AST_NODE_TYPES.TSModuleDeclaration:
        break;
      case AST_NODE_TYPES.VariableDeclaration:
				// We already checked variable in sameExportInBoth function.
			break;
      case AST_NODE_TYPES.TSInterfaceDeclaration:
				return getPropertyDetailsErrorForInterface(
					context,
					exportA.declaration as TSInterfaceDeclaration ,
					(sameExport as ExportNamedDeclaration).declaration as TSInterfaceDeclaration
				);
        break;
      case AST_NODE_TYPES.TSTypeAliasDeclaration:
				return getPropertyDetailsErrorForTypeAlias(
					context,
					exportA.declaration as TSTypeAliasDeclaration ,
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
  item1: ExportNamedDeclaration,
  item2: AST<any>
) {
  return item2.body.find((declarationB) => {
    if (declarationB.type === AST_NODE_TYPES.ExportNamedDeclaration && declarationB.declaration.type === item1.declaration.type) {
      if (
        item1.declaration.type === AST_NODE_TYPES.VariableDeclaration
      ) {
				return context.getTextForCurrentSource(declarationB.declaration) === context.getTextForPrevSource(item1.declaration);
      } else if (
        item1.declaration.type === AST_NODE_TYPES.TSModuleDeclaration
      ) {
        // module declaration implementation is not yet complete
      } else {
        return (
          (
            item1.declaration as unknown as ExportDeclarationWithIdentifier
          ).id.name ===
          (item1.declaration as ExportDeclarationWithIdentifier).id.name
        );
      }
    }
  });
}