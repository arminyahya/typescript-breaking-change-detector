import {
  PROPERTY_CHANGED,
  VARIABLE_CHANGED_OR_REMOVED,
} from "../constants/errors";
import {
  Identifier,
  VariableDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST } from "@typescript-eslint/typescript-estree";
import { Context, getErrorInfo } from "../helper";

export default function variableValidator(
	context: Context,
  prevVar: VariableDeclaration,
  currentCode: AST<any>
) {
  for (const declaration of prevVar.declarations) {
    if (declaration.id.type === "Identifier") {
      const sameVariableInCodeB = currentCode.body.find((node) => {
        if (node.type === "VariableDeclaration") {
          for (const declaration2 of node.declarations) {
            return context.getTextForCurrentSource(declaration2 as unknown as VariableDeclaration)  === context.getTextForPrevSource(declaration);
          }
        }
      });
      if (!sameVariableInCodeB) {
				return getErrorInfo(VARIABLE_CHANGED_OR_REMOVED, context.getTextForPrevSource(declaration));
      }
    }
  }
}

export function getVariableDetailError(
  variableDeclarationInPrevCode: VariableDeclaration,
  variableDeclarationInCurrentCode: VariableDeclaration
) {
  for (const propertyA of variableDeclarationInPrevCode.declarations) {
    const samePropertyInVarB = variableDeclarationInCurrentCode.declarations.find(
      (propertyB) => propertyB === propertyA
    );
    if (!samePropertyInVarB) {
      return PROPERTY_CHANGED;
    }
  }
}
