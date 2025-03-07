import { ENUM_MEMBERS_CHANGED } from "../constants/errors";
import { getErrorInfo } from "../helper";
import {
  Identifier,
  TSEnumDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";

export function checkAllPrevEnumMembersExist(
	context,
  enumDeclarationInPrevCode: TSEnumDeclaration,
  enumDeclarationInCurrentCode: TSEnumDeclaration
) {
  for(const mIndex in enumDeclarationInPrevCode.members) {
    const member = enumDeclarationInPrevCode.members[mIndex];
    if(!enumDeclarationInCurrentCode.members.find(m => (m.id as Identifier).name === (member.id as Identifier).name)) {

        return getErrorInfo(
          ENUM_MEMBERS_CHANGED,
          `look at members of ${enumDeclarationInPrevCode.id.name}`
        );
    }
  }
}
