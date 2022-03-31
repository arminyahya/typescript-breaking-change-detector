import { FUNCTION_PARAMETER_CHANGED, INTERFACE_REMOVED, OPTIONAL_CHANGED, PROPERTY_CHANGED, RETURN_TYPE_CHANGED } from "../constants/errors";
import {
	checkOptionalBeSame,
	checkParamsBeSame,
	checkReturnTypeBeSame,
	Context,
	getErrorInfo,
  getNodeExceptRangeAndLoc,
  getSameTypeDeclaration,
	isPropertyFunction,
	objectToFormatedString,
} from "../helper";

import {TSInterfaceDeclaration, TSCallSignatureDeclaration, TSPropertySignature, TSConstructSignatureDeclaration, TSMethodSignature} from "@typescript-eslint/types/dist/generated/ast-spec";

export default function InterfaceValidator(context: Context, interface1: TSInterfaceDeclaration, codeB ) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    interface1,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(INTERFACE_REMOVED, interface1.id.name);
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
		context,
    interface1,
    sameInterfaceInDeclarationB,
  );
  return propertyDetailsError;
}

export function getPropertyDetailsErrorForInterface(context: Context, item1: TSInterfaceDeclaration, item2: TSInterfaceDeclaration) {
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find((propertyB) => JSON.stringify(getNodeExceptRangeAndLoc(propertyB)) === JSON.stringify(getNodeExceptRangeAndLoc(propertyA)));
    if (!samePropertyInInterfaceB) {
      return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(propertyA)} in interface ${item1.id.name}`);
    }
  }
}