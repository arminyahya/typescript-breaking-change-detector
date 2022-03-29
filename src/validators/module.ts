import { TSModuleDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import { MODULE_REMOVED } from '../constants/errors';
import { getErrorInfo, getSameTypeDeclaration, objectToFormatedString } from '../helper';

export default function moduleValidator(module1: TSModuleDeclaration, codeB) {
	const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    module1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(MODULE_REMOVED, `module ${objectToFormatedString(module1.id)}`);
  }
}