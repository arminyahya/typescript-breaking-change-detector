import compareDeclarations from "..";
import { EXPORT_REMOVED } from "../constants/errors";
import { getPropertyDetailsErrorForInterface, getPropertyDetailsErrorForTypeAlias, sameExportInBoth, throwValidatorError } from "../helper";
import {
  AST_NODE_TYPES,
  ExportNamedDeclaration,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
	ClassDeclaration,
	FunctionDeclaration,
	TSDeclareFunction
} from "@typescript-eslint/types/dist/generated/ast-spec";
import InterfaceValidator from "./interface";
import classValidator, { getClassPropertyDetailError } from "./class";
import { getFunctionDetailsError } from "./function";

export default function ExportValidator(
  exportA: ExportNamedDeclaration,
  codeB
) {
  const sameExport = sameExportInBoth(exportA, codeB);
  if (!sameExport) {
    return EXPORT_REMOVED;
  } else {
    switch (exportA.declaration.type as keyof typeof AST_NODE_TYPES) {
      case AST_NODE_TYPES.ClassDeclaration:
				return getClassPropertyDetailError(exportA.declaration as ClassDeclaration, sameExport.declaration)
      case AST_NODE_TYPES.ClassExpression:
        break;
			case AST_NODE_TYPES.TSDeclareFunction:
				return getFunctionDetailsError(exportA.declaration as TSDeclareFunction, sameExport.declaration)
      case AST_NODE_TYPES.TSEnumDeclaration:
        break;
      case AST_NODE_TYPES.TSModuleDeclaration:
        break;
      case AST_NODE_TYPES.VariableDeclaration:
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
