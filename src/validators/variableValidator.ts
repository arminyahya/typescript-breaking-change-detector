import {
  VARIABLE_CHANGED_OR_REMOVED,
} from "../constants/errors";
import {
  VariableDeclaration,
  VariableDeclarator,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { Context, getErrorInfo } from "../helper";

export default function variableValidator(
  context: Context,
  prevVar: VariableDeclaration,
  currentCode
) {
  for (const declaration of prevVar.declarations) {
    if (declaration.id.type === "Identifier") {
      const sameVariableInCodeB = currentCode.body.find((statement) => {
        if (statement.type === "VariableDeclaration") {
          return statement.declarations.some((currentDecl) =>
            areTypesCompatible(
              context,
              declaration,
              currentDecl
            )
          );
        }
        return false;
      });

      if (!sameVariableInCodeB) {
        return getErrorInfo(
          VARIABLE_CHANGED_OR_REMOVED,
          context.getTextForPrevSource(
            declaration
          )
        );
      }
    }
  }

  return null;
}

function areTypesCompatible(
  context: Context,
  prevDecl: VariableDeclarator,
  currentDecl: VariableDeclarator
): boolean {
  const prevType = context.getTextForPrevSource(prevDecl);
  const currentType = context.getTextForCurrentSource(currentDecl);

  // If either type is missing, treat as incompatible
  if (!prevType || !currentType) {
    return false;
  }

  // Allowable non-breaking changes
  return isTypeAssignable(prevType, currentType);
}

function isTypeAssignable(prevType: string, currentType: string): boolean {
  // Check for compatibility (basic example)
  if (currentType.includes(prevType)) {
    return true;
  }

  // Extend this logic for more robust type comparison
  return false;
}