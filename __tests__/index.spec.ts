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
  VARIABLE_CHANGED_OR_REMOVED,
} from "../src/constants/errors";
import {
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
    `export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}`,
    `interface A {
				name: string;
				age: number;
				getAge: () => string;
			}`,
    EXPORT_REMOVED,
    `interface A {
			name: string;
			age: number;
			getAge: () => string;
		}`
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
    `type A = {
			name: string;
			age: number;
			getAge: () => string;
		}`
  );

  testRunner(
    "Variable Export removed",
    `
		export var myVar: number;
	`,
    `
		var myVar: number;
		`,
    EXPORT_REMOVED,
    `var myVar: number;`
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
    "function parameter changed in type A"
  );

  testRunner(
    "function arg inside alias type changed but it won't break",
    `
		export type A = {
			calcTotal: (a: number, b: number) => number;
		}
`,
    `
export type A = {
	calcTotal: (a: number, b:number, c?:number) => number;
}
`,
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
    "Class method changed but wont break",
    `
		export class MyMath {
			calc(a: number,b: number): void;
		}
`,
    `
export class MyMath {
	calc(a: number,b: number, c?:number): void;
}
`,
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
    "Optional parameter added to the function",
    `
		export function MyMath(a: number, b:number): number;
	`,
    `
	export function MyMath(a: number, b:number, c?:number): number;
	`
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

  test("Variable removed", () => {
    const codeA = `
		export var myVar: number;
	`;
    const codeB = `
		export var mmd: number;
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(EXPORT_REMOVED, "var myVar: number;")
    );
  });

  testRunner(
    "Variable type changed",
    `
	var myVar: number;
	`,
    `
	var myVar: string;
	`,
    VARIABLE_CHANGED_OR_REMOVED,
    "myVar: number"
  );

testRunner(
  "Union type member removed",
  `
  export type MyUnion = "a" | "b" | "c";
  `,
  `
  export type MyUnion = "a" | "b";
  `,
  PROPERTY_CHANGED,
  `Member "c" is missing in type MyUnion`,
);

testRunner(
  "Intersection Type Member Added",
  `
  export type MyIntersection = A & B;
  `,
  `
  export type MyIntersection = A & B & C;
  `,
  PROPERTY_CHANGED,
`New member was added to type MyIntersection`,
)

});
