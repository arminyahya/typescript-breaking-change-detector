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
      const sameVariableInCodeB = currentCode.body.find((statement) => {
        if (statement.type === "VariableDeclaration") {
          for (const declaration2 of statement.declarations) {
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
  for (const propertyInPrevCode of variableDeclarationInPrevCode.declarations) {
    const samePropertyInCurrentCode = variableDeclarationInCurrentCode.declarations.find(
      (property) => property === propertyInPrevCode
    );
    if (!samePropertyInCurrentCode) {
      return PROPERTY_CHANGED;
    }
  }
}
