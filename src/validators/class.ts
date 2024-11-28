import {
  AST_NODE_TYPES,
  ClassDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import {
	CLASS_METHOD_CHANGED,
  CLASS_METHOD_REMOVED,
  CLASS_REMOVED,
  PROPERTY_CHANGED,
} from "../constants/errors";
import {
  checkClassPropertyBeTheSame,
  Context,
  getErrorInfo,
  getSameClassDeclaration,
  getSameMethodForClass,
  getSamePropertyForClass,
} from "../helper";

export default function classValidator(
	context: Context,
  classDeclarationInPrevCode: ClassDeclaration,
  currentCode
) {
  const sameClassInDeclarationB = getSameClassDeclaration(
    classDeclarationInPrevCode,
    currentCode
  );
  if (!sameClassInDeclarationB) {
    return getErrorInfo(CLASS_REMOVED, classDeclarationInPrevCode.id.name);
  }
  return getClassPropertyDetailError( context ,classDeclarationInPrevCode, sameClassInDeclarationB);
}

export function getClassPropertyDetailError(
	context: Context,	
  classDeclarationInPrevCode: ClassDeclaration,
  classDeclarationInCurrentCode: ClassDeclaration
) {
  for (const propertyInPrevCode of classDeclarationInPrevCode.body.body) {
    switch (propertyInPrevCode.type) {
      case AST_NODE_TYPES.PropertyDefinition: {
        const samePropertyInOtherClass = getSamePropertyForClass(
          propertyInPrevCode,
          classDeclarationInCurrentCode
        );
        if (!samePropertyInOtherClass) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(propertyInPrevCode)} in class ${classDeclarationInPrevCode.id.name}`);
        }

        if (!checkClassPropertyBeTheSame(propertyInPrevCode, samePropertyInOtherClass)) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(propertyInPrevCode)} in class ${classDeclarationInPrevCode.id.name}`);
        }
        break;
      }
      case AST_NODE_TYPES.MethodDefinition:
        {
          const sameMehodInOtherClass = getSameMethodForClass(
            propertyInPrevCode,
            classDeclarationInCurrentCode
          );
          if (!sameMehodInOtherClass) {
            return getErrorInfo(CLASS_METHOD_REMOVED, `method ${context.getTextForPrevSource(propertyInPrevCode)} in class ${classDeclarationInPrevCode.id.name}`);
          }

          if (!checkClassPropertyBeTheSame(propertyInPrevCode, sameMehodInOtherClass)) {
            return getErrorInfo(CLASS_METHOD_CHANGED, `method ${context.getTextForPrevSource(propertyInPrevCode)} in class ${classDeclarationInPrevCode.id.name}`);
          }
        }
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
