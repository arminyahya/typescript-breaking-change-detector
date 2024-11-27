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
  checkPropertyBeSame,
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
  for (const property of classDeclarationInPrevCode.body.body) {
    switch (property.type) {
      case AST_NODE_TYPES.PropertyDefinition: {
        const samePropertyInOtherClass = getSamePropertyForClass(
          property,
          classDeclarationInCurrentCode
        );
        if (!samePropertyInOtherClass) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(property)} in class ${classDeclarationInPrevCode.id.name}`);
        }

        if (!checkPropertyBeSame(property, samePropertyInOtherClass)) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(property)} in class ${classDeclarationInPrevCode.id.name}`);
        }
        break;
      }
      case AST_NODE_TYPES.MethodDefinition:
        {
          const sameMehodInOtherClass = getSameMethodForClass(
            property,
            classDeclarationInCurrentCode
          );
          if (!sameMehodInOtherClass) {
            return getErrorInfo(CLASS_METHOD_REMOVED, `method ${context.getTextForPrevSource(property)} in class ${classDeclarationInPrevCode.id.name}`);
          }

          if (!checkPropertyBeSame(property, sameMehodInOtherClass)) {
            return getErrorInfo(CLASS_METHOD_CHANGED, `method ${context.getTextForPrevSource(property)} in class ${classDeclarationInPrevCode.id.name}`);
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
