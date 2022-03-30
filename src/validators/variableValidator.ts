import { PROPERTY_CHANGED } from '../constants/errors';
import { Identifier, VariableDeclaration, } from "@typescript-eslint/types/dist/generated/ast-spec";

export default function variableValidator(var1: VariableDeclaration, codeB) {
	

}

export function getVariableDetailError(item1: VariableDeclaration, item2: VariableDeclaration) {
	for (const propertyA of item1.declarations) {
    const samePropertyInVarB = item2.declarations.find(
      (propertyB) => propertyB === propertyA
    );
    if (!samePropertyInVarB) {
      return PROPERTY_CHANGED;
    }
  }
}