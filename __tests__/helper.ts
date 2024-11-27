import chalk from "chalk";
import isNewDeclarationValid from "../src";
import { generateContext, getErrorInfo, inValidDeclareErrorForTest, pareCode } from "../src/helper";

function getTwoParsedCodeAndContext(code1: string, code2: string) {
  const parsedPrevCode = pareCode(code1);
  const parsedCurrentCode = pareCode(code2);
  const context = generateContext(code1, code2);
  return { context, parsedPrevCode, parsedCurrentCode };
}

export default function testRunner(name, prevCode, currentCode, errorType, errorMessage) {
	test(name, () => {
    const { context, parsedPrevCode, parsedCurrentCode } = getTwoParsedCodeAndContext(
      prevCode,
      currentCode
    );
    const {isValid, info} = isNewDeclarationValid(context, parsedPrevCode, parsedCurrentCode);
		expect(isValid).toBe(false);
    expect(info.replace(/\s/g, "")).toContain(
			chalk.red("Error: " + getErrorInfo(errorType, errorMessage)).replace(/\s/g, "")
    );
  });
}