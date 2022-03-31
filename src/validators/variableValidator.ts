import {
  PROPERTY_CHANGED,
  VARIABLE_CHANGED_OR_REMOVED,
} from "../constants/errors";
import {
  Identifier,
  VariableDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST } from "@typescript-eslint/typescript-estree";

export default function variableValidator(
  var1: VariableDeclaration,
  codeB: AST<any>
) {
  for (const declaration of var1.declarations) {
    if (declaration.id.type === "Identifier") {
      const sameVariableInCodeB = codeB.body.find((node) => {
        if (node.type === "VariableDeclaration") {
          for (const declaration2 of node.declarations) {
            return declaration2 === declaration;
          }
        }
      });
      if (!sameVariableInCodeB) {
        return VARIABLE_CHANGED_OR_REMOVED;
      }
    }
  }
}

export function getVariableDetailError(
  item1: VariableDeclaration,
  item2: VariableDeclaration
) {
  for (const propertyA of item1.declarations) {
    const samePropertyInVarB = item2.declarations.find(
      (propertyB) => propertyB === propertyA
    );
    if (!samePropertyInVarB) {
      return PROPERTY_CHANGED;
    }
  }
}
