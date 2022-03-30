import { OPTIONAL_CHANGED, PROPERTY_CHANGED, RETURN_TYPE_CHANGED } from "../constants/errors";
import { checkOptionalBeSame, checkReturnTypeBeSame, getErrorInfo, getSameProperty, isPropertyFunction, objectToFormatedString } from "../helper";

export default function propertyValidator(context, property, codeB) {
	const sameProperty = getSameProperty(property, codeB);
	if (!sameProperty) {
		return getErrorInfo(PROPERTY_CHANGED, `property ${context.getTextForPrevSource(property)}`);
	} else if (checkOptionalBeSame(property, sameProperty)) {
		return getErrorInfo(OPTIONAL_CHANGED, `property ${context.getTextForPrevSource(property)}`);
	} else if (isPropertyFunction(property)) {
		if (checkReturnTypeBeSame(property, sameProperty)) {
			return getErrorInfo(RETURN_TYPE_CHANGED, `property ${context.getTextForPrevSource(property)}`);
		}
}
}