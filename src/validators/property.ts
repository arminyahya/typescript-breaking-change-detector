import { checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, isPropertyFunction } from "../helper";

export default function propertyValidator(property, codeB) {
	const sameProperty = getSameProperty(property, codeB);
	if (!sameProperty) {
		throw "property removed!";
	} else if (checkOptionalBeSame(property, sameProperty)) {
		return "optional changed!";
	} else if (isPropertyFunction(property)) {
		if (checkReturnTypeBeSame(property, sameProperty)) {
			return "return type changed";
		}
}
}