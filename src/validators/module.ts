import { MODULE_REMOVED } from '../constants/errors';
import { getErrorInfo, getSameTypeDeclaration } from '../helper';

export default function moduleValidator(module1, codeB) {
	const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    module1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(MODULE_REMOVED, `module ${module1.id.name}`);
  }
}