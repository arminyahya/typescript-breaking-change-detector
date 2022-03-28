import { ALIASTYPE_REMOVED, FUNCTION_PARAMETER_CHANGED, OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from '../constants/errors';
import {checkOptionalBeSame, checkParamsBeSame, checkReturnTypeBeSame, getErrorInfo, getSameTypeDeclaration, isPropertyFunction, objectToFormatedString } from '../helper';

export default function TypeAliasValidator(declarationA, codeB) {
	const sameMemberInDeclarationB = getSameTypeDeclaration(
		declarationA,
		codeB
	);
	if (!sameMemberInDeclarationB) {
		return getErrorInfo(ALIASTYPE_REMOVED, declarationA.id.name);
	}
	const propertyDetailsErrorTypeAlias =
		getPropertyDetailsErrorForTypeAlias(
			declarationA,
			sameMemberInDeclarationB
		);
	if (propertyDetailsErrorTypeAlias) {
		return propertyDetailsErrorTypeAlias;
	}
}

export function getPropertyDetailsErrorForTypeAlias(item1, item2) {
  for (const propertyA of item1.typeAnnotation.members) {
    const samePropertyInTypeB = item2.typeAnnotation.members.find(
      (propertyB) => propertyB.key.name === propertyA.key.name
    );

    if (!samePropertyInTypeB) {
      return getErrorInfo(PROPERTY_REMOVED, `property ${objectToFormatedString(propertyA)} in type ${item1.id.name}`);
    } else if (checkOptionalBeSame(propertyA, samePropertyInTypeB)) {
      return getErrorInfo(OPTIONAL_CHANGED, `property ${objectToFormatedString(propertyA)} in type ${item1.id.name}`);
    } else if (isPropertyFunction(samePropertyInTypeB)) {
      if (!checkReturnTypeBeSame(propertyA, samePropertyInTypeB)) {
        return getErrorInfo(RETURN_TYPE_CHANGED, `property ${objectToFormatedString(propertyA)} in type ${item1.id.name}`);
      } else if (!checkParamsBeSame(propertyA, samePropertyInTypeB)) {
        return getErrorInfo(FUNCTION_PARAMETER_CHANGED, `property ${objectToFormatedString(propertyA)} in type ${item1.id.name}`);
      }
    }
  }
}
