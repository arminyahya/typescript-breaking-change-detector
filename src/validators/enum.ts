import { ENUM_MEMBERS_CHANGED, ENUM_REMOVED } from "../constants/errors";
import { getErrorInfo, getSameTypeDeclaration } from "../helper";
import {
  AST_NODE_TYPES,
  Identifier,
  TSEnumDeclaration,
  TSEnumMemberNonComputedName,
} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function EnumValidator( context, enumDeclarationInPrevCode: TSEnumDeclaration, currentCode) {
  const sameEnumInDeclarationB = getSameTypeDeclaration(enumDeclarationInPrevCode, currentCode);
  if (!sameEnumInDeclarationB) {
    return getErrorInfo(ENUM_REMOVED, sameEnumInDeclarationB.id.name);
  }
  return checkAllPrevEnumMembersExist( context ,enumDeclarationInPrevCode, sameEnumInDeclarationB);
}

export function checkAllPrevEnumMembersExist(
	context,
  enumDeclarationInPrevCode: TSEnumDeclaration,
  enumDeclarationInCurrentCode: TSEnumDeclaration
) {
  for(let mIndex in enumDeclarationInPrevCode.members) {
    const member = enumDeclarationInPrevCode.members[mIndex];
    if(!enumDeclarationInCurrentCode.members.find(m => (m.id as Identifier).name === (member.id as Identifier).name)) {

        return getErrorInfo(
          ENUM_MEMBERS_CHANGED,
          `look at members of ${enumDeclarationInPrevCode.id.name}`
        );
    }
  }
}
