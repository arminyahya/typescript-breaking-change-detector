import { TSTypeAliasDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import {
  ALIASTYPE_REMOVED,
  FUNCTION_PARAMETER_CHANGED,
  OPTIONAL_CHANGED,
  PROPERTY_CHANGED,
  RETURN_TYPE_CHANGED,
} from "../constants/errors";
import {
  checkIfFunctionParametersAreValid,
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
  typeInPrevCode,
  typeInCurrentCode
) {
  for (let member of typeInPrevCode.typeAnnotation.members) {
    const sameMemberInCurrentCode = typeInCurrentCode.typeAnnotation.members.find(m => m.key.name === member.key.name);
    if (!sameMemberInCurrentCode) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `property changed in type ${typeInPrevCode.id.name}`
      );
    } else {
      switch (member.typeAnnotation.typeAnnotation.type) {
        case 'TSFunctionType':
          const valid = checkIfFunctionParametersAreValid(member.typeAnnotation.typeAnnotation, sameMemberInCurrentCode.typeAnnotation.typeAnnotation);
          if (!valid) {
            return getErrorInfo(
              PROPERTY_CHANGED,
              `function parameter changed in type ${typeInPrevCode.id.name}`
            );
          }
        /* other cases need to implement */
      }
    }
  }
  console.log('null');
  return null;
}
