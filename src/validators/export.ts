import hasDeclarationBreakingChange from "..";
import { EXPORT_REMOVED } from "../constants/errors";
import {  getErrorInfo, sameExportInBoth, throwValidatorError } from "../helper";
import {
  AST_NODE_TYPES,
  ExportNamedDeclaration,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
	ClassDeclaration,
	FunctionDeclaration,
	VariableDeclaration,
	TSDeclareFunction
} from "@typescript-eslint/types/dist/generated/ast-spec";
import InterfaceValidator, { getPropertyDetailsErrorForInterface } from "./interface";
import classValidator, { getClassPropertyDetailError } from "./class";
import { getFunctionDetailsError } from "./tsDeclareFunction";
import { getVariableDetailError } from "./variableValidator";
import { checkAllPrevEnumMembersExist } from "./enum";
import { getPropertyDetailsErrorForTypeAlias } from "./typeAlias";

export default function ExportValidator(
  exportA: ExportNamedDeclaration,
  codeB
) {
  const sameExport = sameExportInBoth(exportA, codeB);
  if (!sameExport) {
    return getErrorInfo(EXPORT_REMOVED, (exportA.declaration as any).id.name);
  } else {
    switch (exportA.declaration.type as keyof typeof AST_NODE_TYPES) {
      case AST_NODE_TYPES.ClassDeclaration:
				return getClassPropertyDetailError(exportA.declaration as ClassDeclaration, sameExport.declaration)
      case AST_NODE_TYPES.ClassExpression:
        break;
			case AST_NODE_TYPES.TSDeclareFunction:
				return getFunctionDetailsError(exportA.declaration as TSDeclareFunction, sameExport.declaration)
      case AST_NODE_TYPES.TSEnumDeclaration:
				return checkAllPrevEnumMembersExist(exportA.declaration, sameExport.declaration)
      case AST_NODE_TYPES.TSModuleDeclaration:
        break;
      case AST_NODE_TYPES.VariableDeclaration:
				return getVariableDetailError(exportA.declaration as VariableDeclaration, sameExport.declaration)
        break;
      case AST_NODE_TYPES.TSInterfaceDeclaration:
				return getPropertyDetailsErrorForInterface(
					exportA.declaration,
					sameExport.declaration
				);
        break;
      case AST_NODE_TYPES.TSTypeAliasDeclaration:
				return getPropertyDetailsErrorForTypeAlias(
					exportA.declaration,
					sameExport.declaration
				);
        break;

      default:
        break;
    }
  }
}
