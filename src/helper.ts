import {
  AST_NODE_TYPES,
  ClassDeclaration,
  ClassExpression,
  ExportDeclaration,
  FunctionDeclaration,
  MethodDefinition,
  PropertyDefinition,
  PropertyDefinitionNonComputedName,
  StaticBlock,
  TSAbstractMethodDefinition,
  TSAbstractPropertyDefinition,
  TSDeclareFunction,
  TSEnumDeclaration,
  TSIndexSignature,
  TSInterfaceDeclaration,
  TSModuleDeclaration,
  TSTypeAliasDeclaration,
  VariableDeclaration,
  MethodDefinitionNonComputedName,
  BaseNode,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST } from "@typescript-eslint/typescript-estree";
import { ExportNamedDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import chalk from "chalk";
import { parse } from "@typescript-eslint/typescript-estree";
import SourceCode from "./sourcecode";

export type ExportDeclarationWithIdentifier =
  | ClassDeclaration
  | ClassExpression
  | FunctionDeclaration
  | TSDeclareFunction
  | TSEnumDeclaration
  | TSInterfaceDeclaration
  | TSTypeAliasDeclaration;


export function sameExportInBoth(
  item1: ExportNamedDeclaration,
  item2: AST<any>
) {
  return item2.body.find((declarationB) => {
    if (declarationB.type === AST_NODE_TYPES.ExportNamedDeclaration) {
      if (
        declarationB.declaration.type === AST_NODE_TYPES.VariableDeclaration
      ) {
        // variable declaration implementation is not yet complete
      } else if (
        declarationB.declaration.type === AST_NODE_TYPES.TSModuleDeclaration
      ) {
        // module declaration implementation is not yet complete
      } else {
        return (
          (
            declarationB.declaration as unknown as ExportDeclarationWithIdentifier
          ).id.name ===
          (item1.declaration as ExportDeclarationWithIdentifier).id.name
        );
      }
    }
  });
}

export function getNodeExceptRangeAndLoc(node: BaseNode) {
	const { range, loc, ...rest } = node;
	return rest;
}

export function getSameTypeDeclaration(item1, item2) {
	return item2.body.find(
    (declarationB) =>
      JSON.stringify(getNodeExceptRangeAndLoc(declarationB.id)) === JSON.stringify(getNodeExceptRangeAndLoc(item1.id))
  );
}

export function checkParamsBeSame(function1, function2) {
  const function1Params = function1.typeAnnotation.typeAnnotation.params;
  const function2Params = function2.typeAnnotation.typeAnnotation.params;
  return JSON.stringify(function1Params) === JSON.stringify(function2Params);
}

export function checkParamsBeSameForTsDeclare(function1, function2) {
  const function1Params = function1.params;
  const function2Params = function2.params;
  return JSON.stringify(function1Params) === JSON.stringify(function2Params);
}

export function checkOptionalBeSame(item1, item2) {
  return item2.optional !== item1.optional;
}

export function checkReturnTypeBeSame(item1, item2) {
  return (
    JSON.stringify(item2.typeAnnotation.typeAnnotation.returnType) ===
    JSON.stringify(item1.typeAnnotation.typeAnnotation.returnType)
  );
}

export function checkReturnTypeBeSameForTsDeclareFunction(item1, item2) {
  return (
    JSON.stringify(item2.returnType.typeAnnotation.type) ===
    JSON.stringify(item1.returnType.typeAnnotation.type)
  );
}

export function isPropertyFunction(property) {
  return property.typeAnnotation.typeAnnotation.type === "TSFunctionType";
}

export function getSameProperty(peroperty, codeB) {
  return codeB.body.find(
    (propertyB) => propertyB.key.name === peroperty.key.name
  );
}

export function throwValidatorError(error) {
  if (error) {
    throw new Error(error);
  }
}

export function getSameClassDeclaration(
  item1: ClassDeclaration,
  item2
): ClassDeclaration {
  return item2.body.find(
    (declarationB) =>
      declarationB.type === "ClassDeclaration" &&
      declarationB.id.name === item1.id.name
  );
}

export function getSamePropertyForClass(
  property,
  classDeclaration: ClassDeclaration
) {
  return classDeclaration.body.body.find(
    (item) =>
      item.type === AST_NODE_TYPES.PropertyDefinition &&
      (item as any).key.name === property.key.name
  );
}

export function getSameMethodForClass(
  property,
  classDeclaration: ClassDeclaration
) {
  return classDeclaration.body.body.find(
    (item) =>
      item.type === AST_NODE_TYPES.MethodDefinition &&
      (item as any).key.name === property.key.name
  );
}

export function checkPropertyBeSame(property1, property2) {
  return JSON.stringify(property1) === JSON.stringify(property2);
}

export function getErrorInfo(type, info) {
  return `${type} - ${info}`;
}

export function objectToFormatedString(object) {
  return JSON.stringify(object, null, 2);
}

export function addChalkPrefixToString(str) {
  return "Error: " + str;
}

export function inValidDeclareErrorForTest(type, message) {
  return {
    isValid: false,
    info: chalk.red("Error: " + getErrorInfo(type, message)),
  };
}

export function pareCode(code: string) {
  const parsedCode = parse(code, {
    loc: true,
    range: true,
  });
	return parsedCode;
}

export function generateContext(prevCode: string, currentCode: string): Context {
  return {
    getTextForPrevSource: (node) => {
      const sourceCode = new SourceCode(prevCode);
      return sourceCode.getText(node, null, null);
    },
		getTextForCurrentSource: (node) => {
      const sourceCode = new SourceCode(currentCode);
      return sourceCode.getText(node, null, null);
    },
  };
}

export type ASTWithContext = AST<any> & {
  context: Context;
};

export type Context = {
  getTextForPrevSource: (node: BaseNode) => string;
  getTextForCurrentSource: (node: BaseNode) => string;
};
