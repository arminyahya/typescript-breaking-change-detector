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
  ClassElementExceptComputedPropertyDefinition,
  getErrorInfo,
  getSameClassDeclaration,
  getSameMethodForClass,
  getSamePropertyForClass,
} from "../helper";

export default function classValidator(
  classDeclaration: ClassDeclaration,
  codeB
) {
  const sameClassInDeclarationB = getSameClassDeclaration(
    classDeclaration,
    codeB
  );
  if (!sameClassInDeclarationB) {
    return getErrorInfo(CLASS_REMOVED, classDeclaration.id.name);
  }
  return getClassPropertyDetailError(classDeclaration, sameClassInDeclarationB);
}

export function getClassPropertyDetailError(
  classDeclaration1: ClassDeclaration,
  classDeclaration2: ClassDeclaration
) {
  for (const property of classDeclaration1.body.body) {
    switch (property.type) {
      case AST_NODE_TYPES.PropertyDefinition: {
        const samePropertyInOtherClass = getSamePropertyForClass(
          property,
          classDeclaration2
        );
        if (!samePropertyInOtherClass) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${property} in class ${classDeclaration1.id.name}`);
        }

        if (!checkPropertyBeSame(property, samePropertyInOtherClass)) {
          return getErrorInfo(PROPERTY_CHANGED, `property ${property} in class ${classDeclaration1.id.name}`);
        }
        break;
      }
      case AST_NODE_TYPES.MethodDefinition:
        {
          const sameMehodInOtherClass = getSameMethodForClass(
            property,
            classDeclaration2
          );
          if (!sameMehodInOtherClass) {
            return getErrorInfo(CLASS_METHOD_REMOVED, `method ${property} in class ${classDeclaration1.id.name}`);
          }

          if (!checkPropertyBeSame(property, sameMehodInOtherClass)) {
            return getErrorInfo(CLASS_METHOD_CHANGED, `method ${property} in class ${classDeclaration1.id.name}`);
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
