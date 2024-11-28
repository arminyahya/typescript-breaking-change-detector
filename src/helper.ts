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
import { FunctionExpression, FunctionTypeNode } from "typescript";


export function getIdExceptRangeAndLoc(node: BaseNode) {
  const { range, loc, ...rest } = node;
  return rest;
}

export function getSameTypeDeclaration(typeInPrevCode, currentCode) {
  return currentCode.body.find(
    (statement) => {
      return JSON.stringify(getIdExceptRangeAndLoc(statement.id)) === JSON.stringify(getIdExceptRangeAndLoc(typeInPrevCode.id))
    }
  );
}


export function checkIfFunctionParametersAreValid(functionInPrevCode, functionInCurrentCode) {
  if (functionInCurrentCode.params.length < functionInPrevCode.params.length) {
    return false;
  }

  for (let pIndex in functionInCurrentCode.params) {
    const param = functionInCurrentCode.params[pIndex];
    const paramInPrevCode = functionInPrevCode.params[pIndex];
    if (paramInPrevCode) {
      if (paramInPrevCode.optional && !param.optional) {
        return false
      }
    } else {
      if (!param.optional) {
        return false
      }
    }
  }
  return true
}

export function checkOptionalBeSame(itemInPrevCode, itemInCurrentCode) {
  return itemInCurrentCode.optional !== itemInPrevCode.optional;
}

export function checkReturnTypeBeSameForTsDeclareFunction(itemInPrevCode, itemInCurrentCode) {
  return (
    JSON.stringify(itemInCurrentCode.returnType.typeAnnotation.type) ===
    JSON.stringify(itemInPrevCode.returnType.typeAnnotation.type)
  );
}

export function isPropertyFunction(property) {
  return property.typeAnnotation.typeAnnotation.type === "TSFunctionType";
}

export function getSameProperty(peropertyInprevCode, currentCode) {
  return currentCode.body.find(
    (statement) => statement.key.name === peropertyInprevCode.key.name
  );
}

export function checkAndThrowError(error) {
  if (error) {
    throw new Error(error);
  }
}

export function getSameClassDeclaration(
  classDeclarationInPrevCode: ClassDeclaration,
  classDeclarationInCurrentCode
): ClassDeclaration {
  return classDeclarationInCurrentCode.body.find(
    (declaration) =>
      declaration.type === "ClassDeclaration" &&
      declaration.id.name === classDeclarationInPrevCode.id.name
  );
}

export function getSamePropertyForClass(
  propertyInPrevCode,
  classDeclarationInCurrentCode: ClassDeclaration
) {
  return classDeclarationInCurrentCode.body.body.find(
    (item) =>
      item.type === AST_NODE_TYPES.PropertyDefinition &&
      (item as any).key.name === propertyInPrevCode.key.name
  );
}

export function getSameMethodForClass(
  propertyInPrevCode,
  classDeclarationInCurrentCode: ClassDeclaration
) {
  return classDeclarationInCurrentCode.body.body.find(
    (item) =>
      item.type === AST_NODE_TYPES.MethodDefinition &&
      (item as any).key.name === propertyInPrevCode.key.name
  );
}

export function checkClassPropertyBeTheSame(property1, property2) {
  switch (property1.type) {
    case 'PropertyDefinition':
      return property1.typeAnnotation.typeAnnotation.type === property2.typeAnnotation.typeAnnotation.type
    case 'MethodDefinition':
      return checkIfFunctionParametersAreValid(property1.value, property2.value) && property1.value.returnType.type === property2.value.returnType.type;
  }
  return true
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
