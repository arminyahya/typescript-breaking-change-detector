import {readdirSync, readFileSync} from 'fs-extra'
import { PREV_DECLARATION_PATH } from '../declare-snapshot-maker';
import { parse } from "@typescript-eslint/typescript-estree";
import compareDeclarations from '..';

interface Config {
  declarationFiles: string[];
}

export default function compareDeclareFiles({
	declarationFiles
}: Config) {
	const prevDeclareFiles = readdirSync(PREV_DECLARATION_PATH);
	for(const fileName of prevDeclareFiles) {
		const prevFileString = readFileSync(`${PREV_DECLARATION_PATH }/${fileName}`, "utf8");
    const pevParsedCode = parse(prevFileString);
		const currentFile =  declarationFiles.find(f => f === fileName);
		if(!currentFile) {
			throw new Error("file removed!: " + fileName);
		}
		const currentFileString = readFileSync(`./${fileName}`, "utf8");
    const currentParsedCode = parse(currentFileString);
		compareDeclarations(pevParsedCode, currentParsedCode)
	}
}

compareDeclareFiles({declarationFiles: ['A.d.ts']});