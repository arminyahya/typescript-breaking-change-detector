import { TSTypeAliasDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import {
  ALIASTYPE_REMOVED,
  FUNCTION_PARAMETER_CHANGED,
  OPTIONAL_CHANGED,
  PROPERTY_CHANGED,
  RETURN_TYPE_CHANGED,
} from "../constants/errors";
import {
  checkOptionalBeSame,
  checkParamsBeSame,
  checkReturnTypeBeSame,
  getErrorInfo,
  getSameTypeDeclaration,
  isPropertyFunction,
  objectToFormatedString,
} from "../helper";

export default function TypeAliasValidator(
	context,
  prevType: TSTypeAliasDeclaration,
  currentCode
) {
  const sameMemberInDeclarationB = getSameTypeDeclaration(prevType, currentCode);
  if (!sameMemberInDeclarationB) {
    return getErrorInfo(ALIASTYPE_REMOVED, prevType.id.name);
  }
  const propertyDetailsErrorTypeAlias = getPropertyDetailsErrorForTypeAlias(
		context,
    prevType,
    sameMemberInDeclarationB
  );
  if (propertyDetailsErrorTypeAlias) {
    return propertyDetailsErrorTypeAlias;
  }
}

export function getPropertyDetailsErrorForTypeAlias(
	context,
  type1: TSTypeAliasDeclaration,
  type2: TSTypeAliasDeclaration
) {
  if (
    JSON.stringify(type1.typeAnnotation) !==
    JSON.stringify(type2.typeAnnotation)
  ) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `property changed in type ${type1.id.name}`
      );
  }
}
