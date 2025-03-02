import {
  AST_NODE_TYPES,
  ClassDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import {
	CLASS_METHOD_CHANGED,
  CLASS_METHOD_REMOVED,
  CLASS_REMOVED,
  PROPERTY_CHANGED,
  PROPERTY_REMOVED,
} from "../constants/errors";
import {
  checkClassPropertyBeTheSame,
  Context,
  getErrorInfo,
  getSameNodeForClass,
} from "../helper";

export function validateClassProperties(
  context: Context,
  prevClass: ClassDeclaration,
  currentClass: ClassDeclaration
) {
  for (const member of prevClass.body.body) {
    const sameMember =  getSameNodeForClass(member, currentClass);

    if (!sameMember) {
      return getErrorInfo(
        PROPERTY_REMOVED,
        `Property or method ${context.getTextForPrevSource(member)} is missing in ${prevClass.id.name}`
      );
    }

    if (!checkClassPropertyBeTheSame(member, sameMember)) {
      return getErrorInfo(
        PROPERTY_CHANGED,
        `Property or method ${context.getTextForPrevSource(member)} has changed in ${prevClass.id.name}`
      );
    }
  }

  return null;
}