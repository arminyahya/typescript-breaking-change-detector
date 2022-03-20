import {
	throwValidatorError,
} from "./helper";
import ExportValidator from "./validators/export";
import InterfaceValidator from "./validators/interface";
import propertyValidator from "./validators/property";
import TypeAliasValidator from "./validators/typeAlias";


export default function compareDeclarations(codeA, codeB) {
  for (const declarationA of codeA.body) {
    switch (declarationA.type) {
      case "ExportNamedDeclaration":
				throwValidatorError(ExportValidator(declarationA, codeB));
        break;
      case "TSInterfaceDeclaration":
				throwValidatorError(InterfaceValidator(declarationA, codeB));
        break;
      case "TSTypeAliasDeclaration":
				throwValidatorError(TypeAliasValidator(declarationA, codeB))
        break;
      case "TSPropertySignature":
				throwValidatorError(propertyValidator(declarationA, codeB))
        break;
      default:
        break;
    }
  }
}