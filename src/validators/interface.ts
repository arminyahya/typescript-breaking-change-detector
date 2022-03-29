import { FUNCTION_PARAMETER_CHANGED, INTERFACE_REMOVED, OPTIONAL_CHANGED, PROPERTY_CHANGED, RETURN_TYPE_CHANGED } from "../constants/errors";
import {
	checkOptionalBeSame,
	checkParamsBeSame,
	checkReturnTypeBeSame,
	getErrorInfo,
  getSameTypeDeclaration,
	isPropertyFunction,
	objectToFormatedString,
} from "../helper";

import {TSInterfaceDeclaration, TSCallSignatureDeclaration, TSPropertySignature, TSConstructSignatureDeclaration, TSMethodSignature} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function InterfaceValidator(interface1: TSInterfaceDeclaration, codeB) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    interface1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(INTERFACE_REMOVED, interface1.id.name);
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
    interface1,
    sameInterfaceInDeclarationB
  );
  return propertyDetailsError;
}

export function getPropertyDetailsErrorForInterface(item1: TSInterfaceDeclaration, item2: TSInterfaceDeclaration) {
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find((propertyB) => JSON.stringify(propertyB) === JSON.stringify(propertyA));
    if (!samePropertyInInterfaceB) {
      return getErrorInfo(PROPERTY_CHANGED, `property ${objectToFormatedString(propertyA)} in interface ${item1.id.name}`);
    }
  }
}