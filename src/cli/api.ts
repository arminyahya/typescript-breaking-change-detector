import { existsSync } from "fs-extra";
import path from "path";
import areDeclareFilesValid from "../compare-declare-files";
import { CONFIG_FILENAME, PREV_DECLARATION_PATH } from "../constants/filenames";
import declarationSnapShotMaker from "../declare-snapshot-maker";
import { readFileSync } from "fs";
import chalk from "chalk";
import { error } from "console";

interface ApiConfig {
  projectRoot: string;
}
export default function api(config: ApiConfig) {
  const { projectRoot } = config;
  const configFile = readFileSync(path.join(
    projectRoot,
    CONFIG_FILENAME
  ), 'utf-8');

  const {declarationFiles} = JSON.parse(configFile);
	// its first time running detector
	if (!existsSync(path.join(projectRoot,  PREV_DECLARATION_PATH))) {
		declarationSnapShotMaker({ projectRoot, declarationFiles });
	} else {
		const validationResult = areDeclareFilesValid({ projectRoot, declarationFiles });
		if(validationResult.isValid) {
			declarationSnapShotMaker({ projectRoot, declarationFiles });
		} else {
			console.error(validationResult.info)
			throw new error('Error detected during Typescript breaking change detector code analyzing');
		}
	}
}
