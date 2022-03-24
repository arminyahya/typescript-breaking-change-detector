import {
  AST_NODE_TYPES,
  ClassDeclaration,
  PropertyDefinition,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import {
	CLASS_METHOD_CHANGED,
  CLASS_METHOD_REMOVED,
  CLASS_REMOVED,
  PROPERTY_CHANGED,
  PROPERTY_REMOVED,
} from "../constants/errors";
import {
  checkOptionalBeSame,
  checkPropertyBeSame,
  checkReturnTypeBeSame,
  getSameClassDeclaration,
  getSameMethodForClass,
  getSameProperty,
  getSamePropertyForClass,
  isPropertyFunction,
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
    return CLASS_REMOVED;
  }
  return getClassPropertyDetailError(classDeclaration, sameClassInDeclarationB);
}

export function getClassPropertyDetailError(
  classDeclaration1,
  classDeclaration2
) {
  for (const property of classDeclaration1.body.body) {
    switch (property.type) {
      case AST_NODE_TYPES.PropertyDefinition: {
        const samePropertyInOtherClass = getSamePropertyForClass(
          property,
          classDeclaration2
        );
        if (!samePropertyInOtherClass) {
          return PROPERTY_REMOVED;
        }

        if (!checkPropertyBeSame(property, samePropertyInOtherClass)) {
          return PROPERTY_CHANGED;
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
            return CLASS_METHOD_REMOVED;
          }

          if (!checkPropertyBeSame(property, sameMehodInOtherClass)) {
            return CLASS_METHOD_CHANGED;
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
