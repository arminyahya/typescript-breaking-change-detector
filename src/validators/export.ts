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
import { AST } from "@typescript-eslint/typescript-estree";

export default function ExportValidator(
  exportA: ExportNamedDeclaration,
  codeB: AST<any>
) {
  const sameExport= sameExportInBoth(exportA, codeB);
  if (!sameExport) {
    return getErrorInfo(EXPORT_REMOVED, (exportA.declaration as any).id.name);
  } else {
    switch (exportA.declaration.type as keyof typeof AST_NODE_TYPES) {
      case AST_NODE_TYPES.ClassDeclaration:
				return getClassPropertyDetailError(exportA.declaration as ClassDeclaration, (sameExport as ExportNamedDeclaration).declaration as ClassDeclaration)
      case AST_NODE_TYPES.ClassExpression:
        break;
			case AST_NODE_TYPES.TSDeclareFunction:
				return getFunctionDetailsError(exportA.declaration as TSDeclareFunction, (sameExport as ExportNamedDeclaration).declaration)
      case AST_NODE_TYPES.TSEnumDeclaration:
				return checkAllPrevEnumMembersExist(exportA.declaration, (sameExport as ExportNamedDeclaration).declaration)
      case AST_NODE_TYPES.TSModuleDeclaration:
        break;
      case AST_NODE_TYPES.VariableDeclaration:
			// variable declaration is not yet completed
			break;
      case AST_NODE_TYPES.TSInterfaceDeclaration:
				return getPropertyDetailsErrorForInterface(
					exportA.declaration,
					(sameExport as ExportNamedDeclaration).declaration
				);
        break;
      case AST_NODE_TYPES.TSTypeAliasDeclaration:
				return getPropertyDetailsErrorForTypeAlias(
					exportA.declaration,
					(sameExport as ExportNamedDeclaration).declaration
				);
        break;

      default:
        break;
    }
  }
}
