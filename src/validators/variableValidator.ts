import { PROPERTY_CHANGED, PROPERTY_REMOVED, VARIABLE_REMOVED } from '../constants/errors';
import { checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';
import { Identifier, VariableDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";

export default function variableValidator(var1, codeB) {
}

export function getVariableDetailError(item1: VariableDeclaration, item2: VariableDeclaration) {
	for (const propertyA of item1.declarations) {
    const samePropertyInVarB = item2.declarations.find(
      (propertyB) => (propertyB.id as Identifier).name === (propertyA.id as Identifier).name 
    );
    if (!samePropertyInVarB) {
      return PROPERTY_REMOVED;
    } else if(propertyA.id.typeAnnotation.typeAnnotation.type !== samePropertyInVarB.id.typeAnnotation.typeAnnotation.type) {
			return PROPERTY_CHANGED;
		}
  }
}