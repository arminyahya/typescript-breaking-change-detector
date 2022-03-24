import { FUNCTION_PARAMETER_CHANGED, FUNCTION_REMOVED, RETURN_TYPE_CHANGED } from '../constants/errors';
import { checkOptionalBeSame, checkParamsBeSame, checkParamsBeSameForTsDeclare, checkReturnTypeBeSame, checkReturnTypeBeSameForTsDeclareFunction, getErrorInfo, getSameProperty, getSameTypeDeclaration, isPropertyFunction } from '../helper';

export default function tsDeclareFunctionValidator(func, codeB) {
	const sameFunctionInDeclarationB = getSameTypeDeclaration(
    func,
    codeB
  );
  if (!sameFunctionInDeclarationB) {
    return getErrorInfo(FUNCTION_REMOVED, func.id.name);
  }

	const propertyDetailsError = getFunctionDetailsError(
    func,
    sameFunctionInDeclarationB
  );
  return  propertyDetailsError;
}

export function getFunctionDetailsError(func1, func2) {
	if (!checkReturnTypeBeSameForTsDeclareFunction(func1, func2)) {
		return getErrorInfo(RETURN_TYPE_CHANGED, func1.id.name);
	} else if (!checkParamsBeSameForTsDeclare(func1, func2)) {
		return getErrorInfo(FUNCTION_PARAMETER_CHANGED, func1.id.name);
	}
}