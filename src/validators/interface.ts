import {
  checkOptionalBeSame,
  checkReturnTypeBeSame,
  getPropertyDetailsErrorForInterface,
  getSameProperty,
  getSameTypeDeclaration,
  isPropertyFunction,
} from "../helper";

export default function InterfaceValidator(declarationA, codeB) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    declarationA,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return "interface removed!";
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
    declarationA,
    sameInterfaceInDeclarationB
  );
  return propertyDetailsError;
}
