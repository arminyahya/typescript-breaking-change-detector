
export function exportExistInBoth(item1, item2) {
	return item2.body.find(declarationB => declarationB.declaration.id.name === item1.declaration.id.name)
}

export function getSameTypeDeclaration(item1, item2) {
	return item2.body.find(declarationB => declarationB.id.name === item1.id.name);
}

export function getPropertyDetailsErrorForInterface(item1, item2) {
	for (let propertyA of item1.body.body) {
		const samePropertyInInterfaceB = item2.body.body.find(propertyB => propertyB.key.name === propertyA.key.name);
		if (!samePropertyInInterfaceB) {
			return 'property removed!';
		} else if (checkOptionalBeSame(propertyA, samePropertyInInterfaceB)) {
			return 'optional changed!';
		} else if (samePropertyInInterfaceB.typeAnnotation.typeAnnotation.type === 'TSFunctionType') {
			if (checkReturnTypeBeSame(propertyA, samePropertyInInterfaceB)) {
				return 'return type changed';
			}
		}
	}
}

export function checkOptionalBeSame(item1, item2) {
	return item2.optional !== item1.optional;
}

export function checkReturnTypeBeSame(item1, item2) {
	return JSON.stringify(item2.typeAnnotation.typeAnnotation.returnType) !== JSON.stringify(item1.typeAnnotation.typeAnnotation.returnType);
}

export function getPropertyDetailsErrorForTypeAlias(item1, item2) {
	for (let propertyA of item1.typeAnnotation.members) {
		const samePropertyInTypeB = item2.typeAnnotation.members.find(propertyB => propertyB.key.name === propertyA.key.name);

		if (!samePropertyInTypeB) {
			throw 'property removed!';
		} else if (samePropertyInTypeB.optional !== propertyA.optional) {
			throw 'optional changed!';
		} else if (samePropertyInTypeB.typeAnnotation.typeAnnotation.type === 'TSFunctionType') {
			if (JSON.stringify(samePropertyInTypeB.typeAnnotation.typeAnnotation.returnType) !== JSON.stringify(propertyA.typeAnnotation.typeAnnotation.returnType)) {
				throw 'return type changed';
			}
		}
	}
}