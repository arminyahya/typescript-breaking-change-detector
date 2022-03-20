import compareDeclarations from '..';
import { EXPORT_REMOVED } from '../constants/errors';
import { sameExportInBoth } from '../helper';
export default function ExportValidator(exportA, codeB) {
	const sameExport = sameExportInBoth(exportA, codeB);
	if (!sameExport) {
		return EXPORT_REMOVED;
	} else {
		return compareDeclarations(
			exportA.declaration.body,
			sameExport.declaration.body
		);
	}
}