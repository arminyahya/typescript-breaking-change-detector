import { parse } from "@typescript-eslint/typescript-estree";
import compareDeclarations from '../src';
import { CLASS_METHOD_CHANGED, CLASS_METHOD_REMOVED, EXPORT_REMOVED, FUNCTION_PARAMETER_CHANGED, FUNCTION_REMOVED, OPTIONAL_CHANGED, PROPERTY_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../src/constants/errors";

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
				age: number;
				getAge: () => string;
			}
		`;

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(EXPORT_REMOVED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(EXPORT_REMOVED);
  });


	test("Interface Property removed", () => {
    const codeA = `
			type A = {
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(PROPERTY_REMOVED);
  });

	test("AliasType Property removed", () => {
    const codeA = `
			export interface A {
				name: string;
				age: number;
				getAge: () => string;
			}
	`;

    const codeB = `
			export interface A {
					age: number;
					getAge: () => string;
				}
		`;

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(PROPERTY_REMOVED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(RETURN_TYPE_CHANGED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(OPTIONAL_CHANGED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(FUNCTION_PARAMETER_CHANGED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(FUNCTION_PARAMETER_CHANGED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(PROPERTY_REMOVED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(PROPERTY_CHANGED);
  });

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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(CLASS_METHOD_REMOVED);
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

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(CLASS_METHOD_CHANGED);
  });

	test("Fuction return type changed", () => {
    const codeA = `
		export function MyMath(a: number, b:number): number;
	`;

    const codeB = `
		export function MyMath(a: number, b:number): string;
		`;

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(RETURN_TYPE_CHANGED);
  });
	test("Fuction args changed", () => {
    const codeA = `
		export function MyMath(a: number, b:number): number;
	`;

    const codeB = `
		export function MyMath(a: number): number;
		`;

    const parsedCodeA = parse(codeA);
    const parsedCodeB = parse(codeB);
		const fn = () => compareDeclarations(parsedCodeA, parsedCodeB)
    expect(fn).toThrow(FUNCTION_PARAMETER_CHANGED);
  });
});
