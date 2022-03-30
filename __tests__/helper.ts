import isNewDeclarationValid from "../src";
import { generateContext, inValidDeclareErrorForTest, pareCode } from "../src/helper";

function getTwoParsedCodeAndContext(code1: string, code2: string) {
  const parsedCode1 = pareCode(code1);
  const parsedCode2 = pareCode(code2);
  const context = generateContext(code1, code2);
  return { context, parsedCode1, parsedCode2 };
}

export default function testRunner(name, prevCode, currentCode, errorType, errorMessage) {
	test.only(name, () => {
    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      prevCode,
      currentCode
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(inValidDeclareErrorForTest(errorType, errorMessage));
  });
}