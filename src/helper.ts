import {
  ClassDeclaration,
  BaseNode,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST } from "@typescript-eslint/typescript-estree";
import { parse } from "@typescript-eslint/typescript-estree";
import SourceCode from "./sourcecode";

export function getSameTypeDeclaration(typeInPrevCode, currentCode) {
  return currentCode.body.find(
    (statement) => {
      return statement.id.name === typeInPrevCode.id.name
    }
  );
}


export function checkIfFunctionParametersAreValid(functionInPrevCode, functionInCurrentCode) {
  if (functionInCurrentCode.params.length < functionInPrevCode.params.length) {
    return false;
  }

  for (const pIndex in functionInCurrentCode.params) {
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

export function checkReturnTypeBeSameForTsDeclareFunction(itemInPrevCode, itemInCurrentCode) {
  return (
    itemInCurrentCode.returnType.typeAnnotation.type ===
    itemInPrevCode.returnType.typeAnnotation.type
  );
}

export function checkAndThrowError(error) {
  if (error) {
    throw new Error(error);
  }
}

export function getSameNodeForClass(
  nodeInPrevClass: BaseNode,
  classDeclarationInCurrentCode: ClassDeclaration,
) {
  return classDeclarationInCurrentCode.body.body.find(
    (item) =>
      item.type === nodeInPrevClass.type &&
      (item as any).key.name === (nodeInPrevClass as any).key.name
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
