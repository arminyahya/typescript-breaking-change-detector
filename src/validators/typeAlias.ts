import { checkOptionalBeSame, checkReturnTypeBeSame, getPropertyDetailsErrorForTypeAlias, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function TypeAliasValidator(declarationA, codeB) {
	const sameMemberInDeclarationB = getSameTypeDeclaration(
		declarationA,
		codeB
	);
	if (!sameMemberInDeclarationB) {
		return "type removed!";
	}
	const propertyDetailsErrorTypeAlias =
		getPropertyDetailsErrorForTypeAlias(
			declarationA,
			sameMemberInDeclarationB
		);
	if (propertyDetailsErrorTypeAlias) {
		throw propertyDetailsErrorTypeAlias;
	}
}