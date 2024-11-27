import {
  OPTIONAL_CHANGED,
  PROPERTY_CHANGED,
  PROPERTY_REMOVED,
  RETURN_TYPE_CHANGED,
} from "../constants/errors";
import {
  checkOptionalBeSame,
  checkReturnTypeBeSame,
  getErrorInfo,
  getSameProperty,
  isPropertyFunction,
  objectToFormatedString,
} from "../helper";

export default function propertyValidator(context, property, currentCode) {
  const sameProperty = getSameProperty(property, currentCode);
  if (!sameProperty) {
    return getErrorInfo(
      PROPERTY_REMOVED,
      `property ${context.getTextForPrevSource(property)}`
    );
  } else if ( context.getTextForPrevSource(property) !== context.getTextForCurrentSource(sameProperty)) {
    return getErrorInfo(
      OPTIONAL_CHANGED,
      `property ${context.getTextForPrevSource(property)}`
    );
  }
}
