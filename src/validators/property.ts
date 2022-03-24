import { OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../constants/errors";
import { checkOptionalBeSame, checkReturnTypeBeSame, getErrorInfo, getSameProperty, isPropertyFunction } from "../helper";

export default function propertyValidator(property, codeB) {
	const sameProperty = getSameProperty(property, codeB);
	if (!sameProperty) {
		return getErrorInfo(PROPERTY_REMOVED, `property ${property.key.name}`);
	} else if (checkOptionalBeSame(property, sameProperty)) {
		return getErrorInfo(OPTIONAL_CHANGED, `property ${property.key.name}`);
	} else if (isPropertyFunction(property)) {
		if (checkReturnTypeBeSame(property, sameProperty)) {
			return getErrorInfo(RETURN_TYPE_CHANGED, `property ${property.key.name}`);
		}
}
}