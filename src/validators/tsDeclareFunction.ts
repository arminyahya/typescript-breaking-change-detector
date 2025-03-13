import { FUNCTION_PARAMETER_CHANGED, RETURN_TYPE_CHANGED } from '../constants/errors';
import { checkIfFunctionParametersAreValid, checkReturnTypeBeSameForTsDeclareFunction, Context, getErrorInfo } from '../helper';

export function getFunctionDetailsError(context: Context,functionInPrevCode, functionInCurrentCode) {
	if (!checkReturnTypeBeSameForTsDeclareFunction(functionInPrevCode, functionInCurrentCode)) {
		return getErrorInfo(RETURN_TYPE_CHANGED, `${context.getTextForPrevSource(functionInPrevCode)}`);
	} else if (!checkIfFunctionParametersAreValid(functionInPrevCode, functionInCurrentCode)) {
		return getErrorInfo(FUNCTION_PARAMETER_CHANGED, `${context.getTextForPrevSource(functionInPrevCode)}`);
	}
}