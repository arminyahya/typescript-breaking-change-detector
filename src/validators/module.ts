import { TSModuleDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import { MODULE_REMOVED } from '../constants/errors';
import { Context, getErrorInfo, getSameTypeDeclaration, objectToFormatedString } from '../helper';

export default function moduleValidator(content: Context , moduleDeclarationInPrevCode: TSModuleDeclaration, currentCode) {
	const sameInterfaceInDeclarationInCurrentCode = getSameTypeDeclaration(
    moduleDeclarationInPrevCode,
    currentCode
  );
  if (!sameInterfaceInDeclarationInCurrentCode) {
    return getErrorInfo(MODULE_REMOVED, content.getTextForPrevSource(moduleDeclarationInPrevCode));
  }
}