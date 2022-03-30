import isNewDeclarationValid from "../src";
import {
  CLASS_METHOD_CHANGED,
  CLASS_METHOD_REMOVED,
  ENUM_MEMBERS_CHANGED,
  EXPORT_REMOVED,
  FUNCTION_PARAMETER_CHANGED,
  FUNCTION_REMOVED,
  MODULE_REMOVED,
  OPTIONAL_CHANGED,
  PROPERTY_CHANGED,
  RETURN_TYPE_CHANGED,
  VARIABLE_REMOVED,
  VARIABLE_TYPE_CHANGED,
} from "../src/constants/errors";
import {
  addChalkPrefixToString,
  generateContext,
  getErrorInfo,
  inValidDeclareErrorForTest,
  pareCode,
} from "../src/helper";
import SourceCode from "../src/sourcecode";
import testRunner from "./helper";

function getTwoParsedCodeAndContext(code1: string, code2: string) {
  const parsedCode1 = pareCode(code1);
  const parsedCode2 = pareCode(code2);
  const context = generateContext(code1, code2);
  return { context, parsedCode1, parsedCode2 };
}

describe("Breaking Change Tests", () => {
  testRunner(
    "Interface Export removed",
    `
			export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
	`,
    `
		interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
		`,
    EXPORT_REMOVED,
    "A"
  );

  testRunner(
    "AliasType Export removed",
    `
			export type A = {
				name: string;
				age: number;
				getAge: () => string;
			}
	`,
    `
		type A = {
				age: number;
				getAge: () => string;
			}
		`,
    EXPORT_REMOVED,
    "A"
  );

  testRunner(
    "Property return type change",
    `
		export interface A {
			getAge: () => number;
			name: string;
			age: number;
		}
`,
    `
export interface A {
	getAge: () => string;
	age: number;
	name: string;
}
`,
    PROPERTY_CHANGED,
    "property getAge: () => number; in interface A"
  );

  testRunner(
    "Property optional changed",
    `
		export interface A {
			name?: string;
			age: number;
			getAge: () => number;
		}
`,
    `
export interface A {
	name: string;
	age: number;
	getAge: () => number;
}
`,
    PROPERTY_CHANGED,
    "property name?: string; in interface A"
  );

  testRunner(
    "Interface property parameters changed",
    `
		export interface A {
			calcTotal: (a: number, b: number) => number;
		}
`,
    `
export interface A {
	calcTotal: (a: number) => number;
}
`,
    PROPERTY_CHANGED,
    "property calcTotal: (a: number, b: number) => number; in interface A"
  );

  testRunner(
    "AliasType property parameters changed",
    `
		export type A = {
			calcTotal: (a: number, b: number) => number;
		}
`,
    `
export type A = {
	calcTotal: (a: number) => number;
}
`,
    PROPERTY_CHANGED,
    "property changed in type A"
  );

  testRunner(
    "Class Property removed",
    `
		export class Person {
			name: string
		}
`,
    `
export class Person {
}
`,
    PROPERTY_CHANGED,
    "property name: string in class Person"
  );

  testRunner(
    "Class Property changed",
    `
			export class Person {
				name: string
			}
	`,
    `
	export class Person {
		name: number
	}
`,
    PROPERTY_CHANGED,
    "property name: string in class Person"
  );

  testRunner(
    "Class method removed",
    `
		export class MyMath {
			calc(a: number,b: number): void;
		}
`,
    `
export class MyMath {
	total(a: number,b: number): void;
}
`,
    CLASS_METHOD_REMOVED,
    "method calc(a: number,b: number): void; in class MyMath"
  );

  testRunner(
    "Class method changed",
    `
		export class MyMath {
			calc(a: number,b: number): void;
		}
`,
    `
		export class MyMath {
			calc(a: number): void;
		}
`,
    CLASS_METHOD_CHANGED,
    "method calc(a: number,b: number): void; in class MyMath"
  );

  testRunner(
    "Function return type changed",
    `
		export function MyMath(a: number, b:number): number;
	`,
    `
	export function MyMath(a: number, b:number): string;
	`,
    RETURN_TYPE_CHANGED,
    "function MyMath(a: number, b:number): number;"
  );

	testRunner(
    "Function args changed",
		`
		export function MyMath(a: number, b:number): number;
	`,
	`
	export function MyMath(a: number): number;
	`,
	FUNCTION_PARAMETER_CHANGED,
	"function MyMath(a: number, b:number): number;"
  );

	testRunner(
    "Enum member removed",
		`
		export enum MyEnum {
			a,
			b
		}
	`,
	`
		export enum MyEnum {
			a,
		}		`,
		ENUM_MEMBERS_CHANGED,
		"look at members of MyEnum"
  );

  test("Module removed", () => {
    const codeA = `
		module "myModule" {
			const content: string;
			export default content;
		}
	`;
    const codeB = `
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    const { isValid, info } = fn();
    expect(isValid).toBe(false);
    expect(info).toContain(
      "Error: " + MODULE_REMOVED + " - " + 'module "myModule"'
    );
  });

  test.skip("Variable removed", () => {
    const codeA = `
		var myVar: number;
	`;
    const codeB = `
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(VARIABLE_REMOVED, "variable myVar")
    );
  });

  test.skip("Variable type changed", () => {
    const codeA = `
		var myVar: number;
	`;
    const codeB = `
		var myVar: string;
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(VARIABLE_TYPE_CHANGED, "variable myVar")
    );
  });
});
