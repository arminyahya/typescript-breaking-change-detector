import {
  AST_NODE_TYPES,
  ClassDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { CLASS_REMOVED } from "../constants/errors";
import {
  checkOptionalBeSame,
  checkReturnTypeBeSame,
  getSameClassDeclaration,
  getSameProperty,
  isPropertyFunction,
} from "../helper";

export default function ClassValidator(
  classDeclaration: ClassDeclaration,
  codeB
) {
  const sameClassInDeclarationB = getSameClassDeclaration(
    classDeclaration,
    codeB
  );
  if (!sameClassInDeclarationB) {
    return CLASS_REMOVED;
  } else {
    for (const member of classDeclaration.body.body) {
      switch (member.type) {
        case AST_NODE_TYPES.PropertyDefinition:
          break;
        case AST_NODE_TYPES.MethodDefinition:
          break;
        case AST_NODE_TYPES.StaticBlock:
          break;
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
          break;
        case AST_NODE_TYPES.TSAbstractPropertyDefinition:
          break;
        case AST_NODE_TYPES.TSIndexSignature:
          break;
        default:
          break;
      }
    }
  }
}
