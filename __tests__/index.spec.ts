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
  PROPERTY_REMOVED,
  RETURN_TYPE_CHANGED,
  VARIABLE_CHANGED_OR_REMOVED,
} from "../src/constants/errors";
import {
  generateContext,
  getErrorInfo,
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
    "Not exported interface property return type change",
    `
		interface A {
			getAge: () => number;
			name: string;
			age: number;
		}
`,
    `
interface A {
	getAge: () => string;
	age: number;
	name: string;
}
`,
    PROPERTY_CHANGED,
    "property getAge: () => number; in interface A"
  );

  testRunner(
    "Not exported interface changes is not breaking",
    `
		interface A {
			getAge: () => number;
			name: string;
			age: number;
		}
`,
    `
interface A {
	getAge: () => number;
	age: number;
	name: string;
  address?: string;
}
`,
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
    "Not exported alias type property parameters changed",
    `
		type A = {
			calcTotal: (a: number, b: number) => number;
		}
`,
    `
type A = {
	calcTotal: (a: number) => number;
}
`,
    PROPERTY_CHANGED,
    "function parameter changed in type A"
  );

  testRunner(
    "Not exported alias type changed but is not breaking",
    `
		type A = {
			calcTotal: (a: number, b: number) => number;
		}
`,
    `
type A = {
	calcTotal: (a: number, b:number, c?:number) => number;
}
`,
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
    PROPERTY_REMOVED,
    `Property or method name:string is missing in Person`,
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
    `Property or method name:string has changed in Person`,
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
    PROPERTY_REMOVED,
    "Property or method calc(a: number,b: number): void; is missing in MyMath"
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
    PROPERTY_CHANGED,
    "Property or method calc(a: number,b: number): void; has changed in MyMath"
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


  testRunner(
    "Module removed",
    `
    module "myModule" {
			const content: string;
			export default content;
		}
	`,
    ``,
    MODULE_REMOVED,
    `module "myModule"`

  );

  
  testRunner(
    "Module changed but is not breaking",
    `
    module "myModule" {
			const content: string;

			export default content;
		}
	`,
    `
    module "myModule" {
			const content: string;
			const content2: string;

			export default content;
		}
      `

  );


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
    "Variable type changed but its not breaking",
    `
	var myVar: number;
	`,
    `
	var myVar: number | string;
	`,
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
