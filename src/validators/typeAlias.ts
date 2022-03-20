import { ALIASTYPE_REMOVED } from '../constants/errors';
import {getPropertyDetailsErrorForTypeAlias, getSameTypeDeclaration } from '../helper';

export default function TypeAliasValidator(declarationA, codeB) {
	const sameMemberInDeclarationB = getSameTypeDeclaration(
		declarationA,
		codeB
	);
	if (!sameMemberInDeclarationB) {
		return ALIASTYPE_REMOVED;
	}
	const propertyDetailsErrorTypeAlias =
		getPropertyDetailsErrorForTypeAlias(
			declarationA,
			sameMemberInDeclarationB
		);
	if (propertyDetailsErrorTypeAlias) {
		return propertyDetailsErrorTypeAlias;
	}
}