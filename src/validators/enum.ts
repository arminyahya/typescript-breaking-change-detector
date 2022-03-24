import { ENUM_MEMBER_REMOVED, ENUM_REMOVED } from '../constants/errors';
import {  checkOptionalBeSame, checkReturnTypeBeSame, getErrorInfo, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function EnumValidator(enum1, codeB) {
	const sameEnumInDeclarationB = getSameTypeDeclaration(
    enum1,
    codeB
  );
  if (!sameEnumInDeclarationB) {
    return getErrorInfo(ENUM_REMOVED, sameEnumInDeclarationB.id.name);
  }
	return checkAllPrevEnumMembersExist(enum1, sameEnumInDeclarationB)
}


export function checkAllPrevEnumMembersExist(enum1, enum2) {
  for (const propertyA of enum1.members) {
    const sameMemberInEnum2 = enum2.members.find(
      (propertyB) => propertyB.id.name === propertyA.id.name
    );

    if (!sameMemberInEnum2) {
      return getErrorInfo(ENUM_MEMBER_REMOVED, `member ${propertyA.id.name} in enum ${enum1.id.name}`);
    }
  }
}
