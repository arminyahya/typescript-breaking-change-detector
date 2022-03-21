import {
	FUNCTION_PARAMETER_CHANGED,
  OPTIONAL_CHANGED,
  PROPERTY_REMOVED,
  RETURN_TYPE_CHANGED,
} from "./constants/errors";
import {
  AST_NODE_TYPES,
  ExportNamedDeclaration,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  ClassDeclaration,
} from "@typescript-eslint/types/dist/generated/ast-spec";

export function sameExportInBoth(item1 /*: ExportNamedDeclaration*/, item2) {
  return item2.body.find(
    (declarationB) =>
      declarationB.type === "ExportNamedDeclaration" &&
      declarationB.declaration.id.name === item1.declaration.id.name
  );
}

export function getSameTypeDeclaration(item1, item2) {
  return item2.body.find(
    (declarationB) => declarationB.id.name === item1.id.name
  );
}

export function getPropertyDetailsErrorForInterface(item1, item2) {
	console.log('getPropertyDetailsErrorForInterface');
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find(
      (propertyB) => propertyB.key.name === propertyA.key.name
    );
    if (!samePropertyInInterfaceB) {
      return PROPERTY_REMOVED;
    } else if (checkOptionalBeSame(propertyA, samePropertyInInterfaceB)) {
      return OPTIONAL_CHANGED;
    } else if (isPropertyFunction(samePropertyInInterfaceB)) {
      if (!checkReturnTypeBeSame(propertyA, samePropertyInInterfaceB)) {
        return RETURN_TYPE_CHANGED;

      } else if (!checkParamsBeSame(propertyA, samePropertyInInterfaceB)) {
        return FUNCTION_PARAMETER_CHANGED;
      }
    }
  }
}

export function checkParamsBeSame(function1, function2) {
  const function1Params = function1.typeAnnotation.typeAnnotation.params;
  const function2Params = function2.typeAnnotation.typeAnnotation.params;
  return JSON.stringify(function1Params) === JSON.stringify(function2Params);
}

export function checkOptionalBeSame(item1, item2) {
  return item2.optional !== item1.optional;
}

export function checkReturnTypeBeSame(item1, item2) {
  return (
    JSON.stringify(item2.typeAnnotation.typeAnnotation.returnType) ===
    JSON.stringify(item1.typeAnnotation.typeAnnotation.returnType)
  );
}

export function isPropertyFunction(property) {
  return property.typeAnnotation.typeAnnotation.type === "TSFunctionType";
}
export function getPropertyDetailsErrorForTypeAlias(item1, item2) {
  for (const propertyA of item1.typeAnnotation.members) {
    const samePropertyInTypeB = item2.typeAnnotation.members.find(
      (propertyB) => propertyB.key.name === propertyA.key.name
    );

    if (!samePropertyInTypeB) {
      return PROPERTY_REMOVED;
    } else if (checkOptionalBeSame(propertyA, samePropertyInTypeB)) {
      return OPTIONAL_CHANGED;
    } else if (isPropertyFunction(samePropertyInTypeB)) {
      if (!checkReturnTypeBeSame(propertyA, samePropertyInTypeB)) {
        return RETURN_TYPE_CHANGED;
      } else if (!checkParamsBeSame(propertyA, samePropertyInTypeB)) {
        return FUNCTION_PARAMETER_CHANGED;
      }
    }
  }
}

export function getSameProperty(peroperty, codeB) {
  return codeB.body.find(
    (propertyB) => propertyB.key.name === peroperty.key.name
  );
}

export function throwValidatorError(error) {
  if (error) {
    throw new Error(error);
  }
}

export function getSameClassDeclaration(item1: ClassDeclaration, item2): ClassDeclaration {
  return item2.body.find(
    (declarationB) =>
      declarationB.type === "ClassDeclaration" &&
      declarationB.id.name === item1.id.name
  );
}

export function getSamePropertyForClass(property, classDeclaration: ClassDeclaration) {
	return classDeclaration.body.body.find(item => item.type === AST_NODE_TYPES.PropertyDefinition && (item as any).key.name === property.key.name)
}

export function checkPropertyBeSame(property1, property2) {
	return JSON.stringify(property1) === JSON.stringify(property2);
}