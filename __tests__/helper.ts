import chalk from "chalk";
import isNewDeclarationValid from "../src";
import { generateContext, getErrorInfo, inValidDeclareErrorForTest, pareCode } from "../src/helper";

function getTwoParsedCodeAndContext(code1: string, code2: string) {
  const parsedCode1 = pareCode(code1);
  const parsedCode2 = pareCode(code2);
  const context = generateContext(code1, code2);
  return { context, parsedCode1, parsedCode2 };
}

export default function testRunner(name, prevCode, currentCode, errorType, errorMessage) {
	test(name, () => {
    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      prevCode,
      currentCode
    );
    const {isValid, info} = isNewDeclarationValid(context, parsedCode1, parsedCode2);
		expect(isValid).toBe(false);
    expect(info.replace(/\s/g, "")).toContain(
			chalk.red("Error: " + getErrorInfo(errorType, errorMessage)).replace(/\s/g, "")
    );
  });
}