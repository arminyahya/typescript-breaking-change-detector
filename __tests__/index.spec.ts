import { parse } from "@typescript-eslint/typescript-estree";
import compareDeclarations from '../src';
import { EXPORT_REMOVED, OPTIONAL_CHANGED, PROPERTY_REMOVED, RETURN_TYPE_CHANGED } from "../src/constants/errors";

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
});
