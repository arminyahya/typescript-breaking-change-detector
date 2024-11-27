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

export default function propertyValidator(context, propertyInPrevCode, currentCode) {
  const samePropertyInCurrentCode = getSameProperty(propertyInPrevCode, currentCode);
  if (!samePropertyInCurrentCode) {
    return getErrorInfo(
      PROPERTY_REMOVED,
      `property ${context.getTextForPrevSource(propertyInPrevCode)}`
    );
  } else if ( context.getTextForPrevSource(propertyInPrevCode) !== context.getTextForCurrentSource(samePropertyInCurrentCode)) {
    return getErrorInfo(
      OPTIONAL_CHANGED,
      `property ${context.getTextForPrevSource(propertyInPrevCode)}`
    );
  }
}
