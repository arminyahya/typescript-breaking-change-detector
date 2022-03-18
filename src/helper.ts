export function sameExportInBoth(item1, item2) {
  return item2.body.find(
    (declarationB) =>
      declarationB.declaration.id.name === item1.declaration.id.name
  );
}

export function getSameTypeDeclaration(item1, item2) {
  return item2.body.find(
    (declarationB) => declarationB.id.name === item1.id.name
  );
}

export function getPropertyDetailsErrorForInterface(item1, item2) {
  for (const propertyA of item1.body.body) {
    const samePropertyInInterfaceB = item2.body.body.find(
      (propertyB) => propertyB.key.name === propertyA.key.name
    );
    if (!samePropertyInInterfaceB) {
      return "property removed!";
    } else if (checkOptionalBeSame(propertyA, samePropertyInInterfaceB)) {
      return "optional changed!";
    } else if (isPropertyFunction(samePropertyInInterfaceB)) {
      if (checkReturnTypeBeSame(propertyA, samePropertyInInterfaceB)) {
        return "return type changed";
      }
    }
  }
}

export function checkOptionalBeSame(item1, item2) {
  return item2.optional !== item1.optional;
}

export function checkReturnTypeBeSame(item1, item2) {
  return (
    JSON.stringify(item2.typeAnnotation.typeAnnotation.returnType) !==
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
      return "property removed!";
    } else if (checkOptionalBeSame(propertyA, samePropertyInTypeB)) {
      return "optional changed!";
    } else if (isPropertyFunction(samePropertyInTypeB)) {
      if (checkReturnTypeBeSame(propertyA, samePropertyInTypeB)) {
        return "return type changed";
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
    throw error;
  }
}
