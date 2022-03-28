import { OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../constants/errors";
import { checkOptionalBeSame, checkReturnTypeBeSame, getErrorInfo, getSameProperty, isPropertyFunction, objectToFormatedString } from "../helper";

export default function propertyValidator(property, codeB) {
	const sameProperty = getSameProperty(property, codeB);
	if (!sameProperty) {
		return getErrorInfo(PROPERTY_REMOVED, `property ${objectToFormatedString(property)}`);
	} else if (checkOptionalBeSame(property, sameProperty)) {
		return getErrorInfo(OPTIONAL_CHANGED, `property ${objectToFormatedString(property)}`);
	} else if (isPropertyFunction(property)) {
		if (checkReturnTypeBeSame(property, sameProperty)) {
			return getErrorInfo(RETURN_TYPE_CHANGED, `property ${objectToFormatedString(property)}`);
		}
}
}