import { FUNCTION_PARAMETER_CHANGED, FUNCTION_REMOVED, RETURN_TYPE_CHANGED } from '../constants/errors';
import { checkIfFunctionParametersAreValid, checkReturnTypeBeSameForTsDeclareFunction, Context, getErrorInfo, getSameTypeDeclaration, objectToFormatedString } from '../helper';

export default function tsDeclareFunctionValidator( context: Context, functionDeclarationInPrevCode, currentCode) {
	const sameFunctionInDeclarationInCurrentCode = getSameTypeDeclaration(
    functionDeclarationInPrevCode,
    currentCode
  );
  if (!sameFunctionInDeclarationInCurrentCode) {
    return getErrorInfo(FUNCTION_REMOVED, functionDeclarationInPrevCode.id.name);
  }

	const propertyDetailsError = getFunctionDetailsError(
		context,
    functionDeclarationInPrevCode,
    sameFunctionInDeclarationInCurrentCode
  );
  return  propertyDetailsError;
}

export function getFunctionDetailsError(context: Context,functionInPrevCode, functionInCurrentCode) {
	if (!checkReturnTypeBeSameForTsDeclareFunction(functionInPrevCode, functionInCurrentCode)) {
		return getErrorInfo(RETURN_TYPE_CHANGED, `${context.getTextForPrevSource(functionInPrevCode)}`);
	} else if (!checkIfFunctionParametersAreValid(functionInPrevCode, functionInCurrentCode)) {
		return getErrorInfo(FUNCTION_PARAMETER_CHANGED, `${context.getTextForPrevSource(functionInPrevCode)}`);
	}
}