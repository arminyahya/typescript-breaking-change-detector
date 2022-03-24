import { ENUM_REMOVED } from '../constants/errors';
import { checkAllPrevEnumMembersExist, checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function EnumValidator(enum1, codeB) {
	const sameEnumInDeclarationB = getSameTypeDeclaration(
    enum1,
    codeB
  );
  if (!sameEnumInDeclarationB) {
    return ENUM_REMOVED;
  }
	return checkAllPrevEnumMembersExist(enum1, sameEnumInDeclarationB)
}