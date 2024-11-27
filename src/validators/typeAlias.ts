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
  typeInPrevCode: TSTypeAliasDeclaration,
  currentCode
) {
  const sameMemberInDeclarationB = getSameTypeDeclaration(typeInPrevCode, currentCode);
  if (!sameMemberInDeclarationB) {
    return getErrorInfo(ALIASTYPE_REMOVED, typeInPrevCode.id.name);
  }
  const propertyDetailsErrorTypeAlias = getPropertyDetailsErrorForTypeAlias(
		context,
    typeInPrevCode,
    sameMemberInDeclarationB
  );
  if (propertyDetailsErrorTypeAlias) {
    return propertyDetailsErrorTypeAlias;
  }
}

export function getPropertyDetailsErrorForTypeAlias(
	context,
  typeInPrevCode: TSTypeAliasDeclaration,
  typeInCurrentCode: TSTypeAliasDeclaration
) {
  if (
    JSON.stringify(typeInPrevCode.typeAnnotation) !==
    JSON.stringify(typeInCurrentCode.typeAnnotation)
  ) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `property changed in type ${typeInPrevCode.id.name}`
      );
  }
}
