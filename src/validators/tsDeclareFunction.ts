import { FUNCTION_PARAMETER_CHANGED, FUNCTION_REMOVED, RETURN_TYPE_CHANGED } from '../constants/errors';
import { checkOptionalBeSame, checkParamsBeSame, checkParamsBeSameForTsDeclare, checkReturnTypeBeSame, checkReturnTypeBeSameForTsDeclareFunction, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function tsDeclareFunctionValidator(func, codeB) {
	const sameFunctionInDeclarationB = getSameTypeDeclaration(
    func,
    codeB
  );
  if (!sameFunctionInDeclarationB) {
    return FUNCTION_REMOVED;
  }

	const propertyDetailsError = getFunctionDetailsError(
    func,
    sameFunctionInDeclarationB
  );
  return propertyDetailsError;
}

export function getFunctionDetailsError(func1, func2) {
	if (!checkReturnTypeBeSameForTsDeclareFunction(func1, func2)) {
		return RETURN_TYPE_CHANGED;
	} else if (!checkParamsBeSameForTsDeclare(func1, func2)) {
		return FUNCTION_PARAMETER_CHANGED;
	}
}