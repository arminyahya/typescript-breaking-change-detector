import { ENUM_MEMBERS_CHANGED, ENUM_REMOVED } from "../constants/errors";
import { getErrorInfo, getSameTypeDeclaration } from "../helper";
import {
  AST_NODE_TYPES,
  Identifier,
  TSEnumDeclaration,
  TSEnumMemberNonComputedName,
} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function EnumValidator( context ,prevEnum: TSEnumDeclaration, currentCode) {
  const sameEnumInDeclarationB = getSameTypeDeclaration(prevEnum, currentCode);
  if (!sameEnumInDeclarationB) {
    return getErrorInfo(ENUM_REMOVED, sameEnumInDeclarationB.id.name);
  }
  return checkAllPrevEnumMembersExist( context ,prevEnum, sameEnumInDeclarationB);
}

export function checkAllPrevEnumMembersExist(
	context,
  enum1: TSEnumDeclaration,
  enum2: TSEnumDeclaration
) {
  if (JSON.stringify(enum1.members) !== JSON.stringify(enum2.members)) {
    return getErrorInfo(
      ENUM_MEMBERS_CHANGED,
      `look at members of ${enum1.id.name}`
    );
  }
}
