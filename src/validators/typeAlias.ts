import { TSIntersectionType, TSTypeAliasDeclaration, TSUnionType } from "@typescript-eslint/types/dist/generated/ast-spec";
import {
  ALIASTYPE_REMOVED,
  PROPERTY_CHANGED,
} from "../constants/errors";
import {
  checkIfFunctionParametersAreValid,
  Context,
  getErrorInfo,
  getSameTypeDeclaration,
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
  if (typeInPrevCode.typeAnnotation.type === 'TSUnionType' || typeInPrevCode.typeAnnotation.type === 'TSIntersectionType') {
    return compareUnionOrIntersectionMembers(context, typeInPrevCode.typeAnnotation.types, typeInCurrentCode.typeAnnotation.types, typeInPrevCode.id.name)
  } else {

    for (const member of typeInPrevCode.typeAnnotation.members) {
      const sameMemberInCurrentCode = typeInCurrentCode.typeAnnotation.members.find(m => m.key.name === member.key.name);
      if (!sameMemberInCurrentCode) {
        return getErrorInfo(
          PROPERTY_CHANGED,
          `property changed in type ${typeInPrevCode.id.name}`
        );
      } else {

        switch (member.typeAnnotation?.typeAnnotation?.type) {
          case 'TSFunctionType':
            const valid = checkIfFunctionParametersAreValid(member.typeAnnotation.typeAnnotation, sameMemberInCurrentCode.typeAnnotation.typeAnnotation);
            if (!valid) {
              return getErrorInfo(
                PROPERTY_CHANGED,
                `function parameter changed in type ${typeInPrevCode.id.name}`
              );
            }
            break;

          /* other cases need to implement */
        }
      }
    }
  }
  return null;
}

function compareUnionOrIntersectionMembers(
  context: Context,
  prevMembers: TSUnionType[] | TSIntersectionType[],
  currentMembers: TSUnionType[] | TSIntersectionType[],
  aliasName
) {
  const prevMemberTexts = prevMembers.map((member) => context.getTextForPrevSource(member));
  const currentMemberTexts = currentMembers.map((member) =>
    context.getTextForCurrentSource(member)
  );

  // Check for missing members in the current type
  for (const prevMember of prevMemberTexts) {
    if (!currentMemberTexts.includes(prevMember)) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `Member ${prevMember} is missing in type ${aliasName}`
      );
    }
  }

  // Check for new members in the current type (if considered breaking)
  for (const currentMember of currentMemberTexts) {
    if (!prevMemberTexts.includes(currentMember)) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `New member was added to type ${aliasName}`
      );
    }
  }

  return null;
}