import { OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../constants/errors";
import { checkOptionalBeSame, checkReturnTypeBeSame, getSameProperty, isPropertyFunction } from "../helper";

export default function propertyValidator(property, codeB) {
	const sameProperty = getSameProperty(property, codeB);
	if (!sameProperty) {
		return PROPERTY_REMOVED;
	} else if (checkOptionalBeSame(property, sameProperty)) {
		return OPTIONAL_CHANGED;
	} else if (isPropertyFunction(property)) {
		if (checkReturnTypeBeSame(property, sameProperty)) {
			return RETURN_TYPE_CHANGED;
		}
}
}