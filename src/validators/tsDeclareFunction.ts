import { FUNCTION_PARAMETER_CHANGED, FUNCTION_REMOVED, RETURN_TYPE_CHANGED } from '../constants/errors';
import { checkParamsBeSameForTsDeclare, checkReturnTypeBeSameForTsDeclareFunction, Context, getErrorInfo, getSameTypeDeclaration, objectToFormatedString } from '../helper';

export default function tsDeclareFunctionValidator( context: Context ,func, codeB) {
	const sameFunctionInDeclarationB = getSameTypeDeclaration(
    func,
    codeB
  );
  if (!sameFunctionInDeclarationB) {
    return getErrorInfo(FUNCTION_REMOVED, func.id.name);
  }

	const propertyDetailsError = getFunctionDetailsError(
		context,
    func,
    sameFunctionInDeclarationB
  );
  return  propertyDetailsError;
}

export function getFunctionDetailsError(context: Context,func1, func2) {
	if (!checkReturnTypeBeSameForTsDeclareFunction(func1, func2)) {
		return getErrorInfo(RETURN_TYPE_CHANGED, `${context.getTextForPrevSource(func1)}`);
	} else if (!checkParamsBeSameForTsDeclare(func1, func2)) {
		return getErrorInfo(FUNCTION_PARAMETER_CHANGED, `${context.getTextForPrevSource(func1)}`);
	}
}