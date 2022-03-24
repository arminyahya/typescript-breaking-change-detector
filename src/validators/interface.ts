import { FUNCTION_PARAMETER_CHANGED, INTERFACE_REMOVED, OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../constants/errors";
import {
	checkOptionalBeSame,
	checkParamsBeSame,
	checkReturnTypeBeSame,
	getErrorInfo,
  getSameTypeDeclaration,
	isPropertyFunction,
} from "../helper";

export default function InterfaceValidator(declarationA, codeB) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    declarationA,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return getErrorInfo(INTERFACE_REMOVED, declarationA.id.name);
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
    declarationA,
    sameInterfaceInDeclarationB
  );
  return propertyDetailsError;
}

export function getPropertyDetailsErrorForInterface(item1, item2) {
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find(
      (propertyB) => propertyB.key.name === propertyA.key.name
    );
    if (!samePropertyInInterfaceB) {
      return getErrorInfo(PROPERTY_REMOVED, `property ${propertyA.key.name} in interface ${item1.id.name}`);
    } else if (checkOptionalBeSame(propertyA, samePropertyInInterfaceB)) {
      return getErrorInfo(OPTIONAL_CHANGED, `property ${propertyA.key.name} in interface ${item1.id.name}`);
    } else if (isPropertyFunction(samePropertyInInterfaceB)) {
      if (!checkReturnTypeBeSame(propertyA, samePropertyInInterfaceB)) {
        return getErrorInfo(RETURN_TYPE_CHANGED, `property ${propertyA.key.name} in interface ${item1.id.name}`);
      } else if (!checkParamsBeSame(propertyA, samePropertyInInterfaceB)) {
        return getErrorInfo(FUNCTION_PARAMETER_CHANGED, `property ${propertyA.key.name} in interface ${item1.id.name}`);
      }
    }
  }
}