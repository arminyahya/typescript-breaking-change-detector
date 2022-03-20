import { INTERFACE_REMOVED } from "../constants/errors";
import {
  getPropertyDetailsErrorForInterface,
  getSameTypeDeclaration,
} from "../helper";

export default function InterfaceValidator(declarationA, codeB) {
  const sameInterfaceInDeclarationB = getSameTypeDeclaration(
    declarationA,
    codeB
  );
  if (!sameInterfaceInDeclarationB) {
    return INTERFACE_REMOVED;
  }
  const propertyDetailsError = getPropertyDetailsErrorForInterface(
    declarationA,
    sameInterfaceInDeclarationB
  );
  return propertyDetailsError;
}
