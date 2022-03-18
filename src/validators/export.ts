import { checkBodyOfDeclaration } from '..';
import { checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, isPropertyFunction, sameExportInBoth } from '../helper';
export default function ExportValidator(exportA, codeB) {
	const sameExport = sameExportInBoth(exportA, codeB);
	if (!sameExportInBoth) {
		return "export removed!";
	} else {
		return checkBodyOfDeclaration(
			exportA.declaration.body,
			sameExport.declaration.body
		);
	}
}