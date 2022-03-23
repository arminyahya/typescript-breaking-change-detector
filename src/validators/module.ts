import { MODULE_REMOVED } from '../constants/errors';
import { checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function moduleValidator(module1, codeB) {
	const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    module1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return MODULE_REMOVED;
  }
}