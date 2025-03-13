import { readdirSync, readFileSync } from "fs-extra";
import { parse } from "@typescript-eslint/typescript-estree";
import path from "path";
import isNewDeclarationValid from "..";
import { PREV_DECLARATION_PATH, CONFIG_FILENAME } from "../constants/filenames";
import { generateContext, pareCode } from "../helper";

interface Config {
  projectRoot: string;
  declarationFiles: string[];
}

export default function areDeclareFilesValid({
  projectRoot,
  declarationFiles,
}: Config) {
  const configFilePath = path.join(projectRoot, CONFIG_FILENAME);
  const configFile = readFileSync(configFilePath, "utf-8");
  const { declarationFiles: prevDeclareFiles } = JSON.parse(configFile);

  for (const fileName of prevDeclareFiles) {
    const prevFileString = readFileSync(
      path.join(projectRoot, `${PREV_DECLARATION_PATH}/${fileName}`),
      "utf8"
    );
    const pevParsedCode = pareCode(prevFileString);
    
    const currentFile = declarationFiles.find((f) => f === fileName);
    if (!currentFile) {
      throw new Error("file removed!: " + fileName);
    }
    const currentFileString = readFileSync(
      path.join(projectRoot, `./${fileName}`),
      "utf8"
    );
    const currentParsedCode = parse(currentFileString, {
      loc: true,
      range: true,
    });
    const context = generateContext(prevFileString, currentFileString);
    const validationResult = isNewDeclarationValid(
      context,
      pevParsedCode,
      currentParsedCode
    );
    if (!validationResult.isValid) {
      return validationResult;
    }
  }
  return { isValid: true };
}
