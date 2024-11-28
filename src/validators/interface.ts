import { FUNCTION_PARAMETER_CHANGED, INTERFACE_REMOVED, OPTIONAL_CHANGED, PROPERTY_CHANGED, RETURN_TYPE_CHANGED } from "../constants/errors";
import {
	checkOptionalBeSame,
	Context,
	getErrorInfo,
  getSameTypeDeclaration,
	isPropertyFunction,
	objectToFormatedString,
} from "../helper";

import {TSInterfaceDeclaration, TSCallSignatureDeclaration, TSPropertySignature, TSConstructSignatureDeclaration, TSMethodSignature} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function InterfaceValidator(context: Context, interfaceDeclarationInPrevCode: TSInterfaceDeclaration, currentCode ) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    interfaceDeclarationInPrevCode,
    currentCode
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(INTERFACE_REMOVED, interfaceDeclarationInPrevCode.id.name);
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
		context,
    interfaceDeclarationInPrevCode,
    sameInterfaceInDeclarationB,
  );
  return propertyDetailsError;
}

export function getPropertyDetailsErrorForInterface(context: Context, interfaceDeclarationInPrevCode: TSInterfaceDeclaration, interfaceDeclarationInCurrentCode: TSInterfaceDeclaration) {
  for (const prevCodeInterfaceProperty of interfaceDeclarationInPrevCode.body.body) {
    const samePropertyInPrevCodeInterface = interfaceDeclarationInCurrentCode.body.body.find((currentInterfaceProperty) => context.getTextForCurrentSource(currentInterfaceProperty) ===  context.getTextForPrevSource(prevCodeInterfaceProperty));
    if (!samePropertyInPrevCodeInterface) {
      return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(prevCodeInterfaceProperty)} in interface ${interfaceDeclarationInPrevCode.id.name}`);
    }
  }
}