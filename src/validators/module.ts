import { TSModuleDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import { MODULE_REMOVED } from '../constants/errors';
import { Context, getErrorInfo, getNodeExceptRangeAndLoc, getSameTypeDeclaration, objectToFormatedString } from '../helper';

export default function moduleValidator(content: Context , module1: TSModuleDeclaration, codeB) {
	const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    module1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(MODULE_REMOVED, content.getTextForPrevSource(module1));
  }
}