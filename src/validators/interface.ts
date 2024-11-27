import { FUNCTION_PARAMETER_CHANGED, INTERFACE_REMOVED, OPTIONAL_CHANGED, PROPERTY_CHANGED, RETURN_TYPE_CHANGED } from "../constants/errors";
import {
	checkOptionalBeSame,
	checkParamsBeSame,
	checkReturnTypeBeSame,
	Context,
	getErrorInfo,
  getSameTypeDeclaration,
	isPropertyFunction,
	objectToFormatedString,
} from "../helper";

import {TSInterfaceDeclaration, TSCallSignatureDeclaration, TSPropertySignature, TSConstructSignatureDeclaration, TSMethodSignature} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function InterfaceValidator(context: Context, prevInterface: TSInterfaceDeclaration, currentCode ) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    prevInterface,
    currentCode
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(INTERFACE_REMOVED, prevInterface.id.name);
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
		context,
    prevInterface,
    sameInterfaceInDeclarationB,
  );
  return propertyDetailsError;
}

export function getPropertyDetailsErrorForInterface(context: Context, item1: TSInterfaceDeclaration, item2: TSInterfaceDeclaration) {
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find((propertyB) => context.getTextForCurrentSource(propertyB) ===  context.getTextForPrevSource(propertyA));
    if (!samePropertyInInterfaceB) {
      return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(propertyA)} in interface ${item1.id.name}`);
    }
  }
}