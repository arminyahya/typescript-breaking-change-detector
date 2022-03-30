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

function getTwoParsedCodeAndContext(code1: string, code2: string) {
  const parsedCode1 = pareCode(code1);
  const parsedCode2 = pareCode(code2);
  const context = generateContext(code1, code2);
  return { context, parsedCode1, parsedCode2 };
}
describe("Breaking Change Tests", () => {
  test("Interface Export removed", () => {
    const codeA = `
			export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
	`;

    const codeB = `
		interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
		`;
    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(inValidDeclareErrorForTest(EXPORT_REMOVED, "A"));
  });

  test("AliasType Export removed", () => {
    const codeA = `
			export type A = {
				name: string;
				age: number;
				getAge: () => string;
			}
	`;

    const codeB = `
		type A = {
				age: number;
				getAge: () => string;
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(inValidDeclareErrorForTest(EXPORT_REMOVED, "A"));
  });

  test("Interface Property removed", () => {
    const codeA = `
			interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
	`;

    const codeB = `
		interface A {
				age: number;
				getAge: () => string;
			}
		`;
    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        PROPERTY_CHANGED,
        "property name: string; in interface A"
      )
    );
  });

  test("AliasType Property removed", () => {
    const codeA = `
			export type A = {
				name: string;
				age: number;
				getAge: () => string;
			}
	`;

    const codeB = `
			export type A  = {
					age: number;
					getAge: () => string;
				}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(PROPERTY_CHANGED, "property changed in type A")
    );
  });

  test("Property return type change", () => {
    const codeA = `
			export interface A {
				name: string;
				age: number;
				getAge: () => number;
			}
	`;

    const codeB = `
			export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        PROPERTY_CHANGED,
        "property getAge: () => number; in interface A"
      )
    );
  });

  test("Property optional changed", () => {
    const codeA = `
			export interface A {
				name?: string;
				age: number;
				getAge: () => number;
			}
	`;

    const codeB = `
			export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        PROPERTY_CHANGED,
        "property name?: string; in interface A"
      )
    );
  });

  test("Interface property parameters changed", () => {
    const codeA = `
			export interface A {
				calcTotal: (a: number, b: number) => number;
			}
	`;

    const codeB = `
		export interface A {
			calcTotal: (a: number) => number;
		}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        PROPERTY_CHANGED,
        "property calcTotal: (a: number, b: number) => number; in interface A"
      )
    );
  });

  test("AliasType property parameters changed", () => {
    const codeA = `
			export type A = {
				calcTotal: (a: number, b: number) => number;
			}
	`;

    const codeB = `
		export type A = {
			calcTotal: (a: number) => number;
		}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(PROPERTY_CHANGED, "property changed in type A")
    );
  });

  test("Class Property removed", () => {
    const codeA = `
			export class Person {
				name: string
			}
	`;

    const codeB = `
			export class Person {
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        PROPERTY_CHANGED,
        "property name: string in class Person"
      )
    );
  });

  test("Class Property changed", () => {
    const codeA = `
			export class Person {
				name: string
			}
	`;

    const codeB = `
			export class Person {
				name: number
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
	expect(fn()).toMatchObject(
			inValidDeclareErrorForTest( PROPERTY_CHANGED, "property name: string in class Person" )
	)});	

  test("Class method removed", () => {
    const codeA = `
			export class MyMath {
				calc(a: number,b: number): void;
			}
	`;

    const codeB = `
			export class MyMath {
				total(a: number,b: number): void;
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        CLASS_METHOD_REMOVED,
        "method calc(a: number,b: number): void; in class MyMath"
      )
    );
  });

  test("Class method changed", () => {
    const codeA = `
			export class MyMath {
				calc(a: number,b: number): void;
			}
	`;

    const codeB = `
			export class MyMath {
				calc(a: number): void;
			}
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        CLASS_METHOD_CHANGED,
        "method calc(a: number,b: number): void; in class MyMath"
      )
    );
  });

  test("Function return type changed", () => {
    const codeA = `
		export function MyMath(a: number, b:number): number;
	`;

    const codeB = `
		export function MyMath(a: number, b:number): string;
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        RETURN_TYPE_CHANGED,
        "function MyMath(a: number, b:number): number;"
      )
    );
  });

  test("Function args changed", () => {
    const codeA = `
		export function MyMath(a: number, b:number): number;
	`;

    const codeB = `
		export function MyMath(a: number): number;
		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        FUNCTION_PARAMETER_CHANGED,
        "function MyMath(a: number, b:number): number;"
      )
    );
  });

  test("Enum member removed", () => {
    const codeA = `
		export enum MyEnum {
			a,
			b
		}
	`;

    const codeB = `
		export enum MyEnum {
			a,
		}		`;

    const { context, parsedCode1, parsedCode2 } = getTwoParsedCodeAndContext(
      codeA,
      codeB
    );
    const fn = () => isNewDeclarationValid(context, parsedCode1, parsedCode2);
    expect(fn()).toMatchObject(
      inValidDeclareErrorForTest(
        ENUM_MEMBERS_CHANGED,
        "look at members of MyEnum"
      )
    );
  });

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
		const {isValid, info} = fn();
		expect(isValid).toBe(false);
		expect(info).toContain(
		"Error: " + 	MODULE_REMOVED + " - " + "module \"myModule\"");
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
			inValidDeclareErrorForTest( VARIABLE_REMOVED, "variable myVar")
		)});

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
		expect(fn()).toMatchObject( inValidDeclareErrorForTest( VARIABLE_TYPE_CHANGED, "variable myVar"));
  });
});
