import {readdirSync, readFileSync} from 'fs-extra'
import { PREV_DECLARATION_PATH } from '../declare-snapshot-maker';
import { parse } from "@typescript-eslint/typescript-estree";
import path from 'path';
import isNewDeclarationValid from '..';

interface Config {
	projectRoot: string;
  declarationFiles: string[];
}

export default function areDeclareFilesValid({
	projectRoot,
	declarationFiles
}: Config) {
	const prevDeclareFiles = readdirSync(path.join(projectRoot,PREV_DECLARATION_PATH));
	for(const fileName of prevDeclareFiles) {
		const prevFileString = readFileSync(path.join(projectRoot, `${PREV_DECLARATION_PATH }/${fileName}`), "utf8");
    const pevParsedCode = parse(prevFileString);
		const currentFile =  declarationFiles.find(f => f === fileName);
		if(!currentFile) {
			throw new Error("file removed!: " + fileName);
		}
		const currentFileString = readFileSync(path.join(projectRoot,`./${fileName}`), "utf8");
    const currentParsedCode = parse(currentFileString);
		if(!isNewDeclarationValid(pevParsedCode, currentParsedCode)) {
			return false;
		}
	}
return true;
}
