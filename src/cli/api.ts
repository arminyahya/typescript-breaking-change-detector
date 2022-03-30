import { existsSync } from "fs-extra";
import path from "path";
import areDeclareFilesValid from "../compare-declare-files";
import { CONFIG_FILENAME, PREV_DECLARATION_PATH } from "../constants/filenames";
import declarationSnapShotMaker from "../declare-snapshot-maker";

/* eslint-disable @typescript-eslint/no-var-requires */
interface ApiConfig {
  projectRoot: string;
}
export default function api(config: ApiConfig) {
  const { projectRoot } = config;
  const { declarationFiles } = require(path.join(
    projectRoot,
    CONFIG_FILENAME
  ));

	// its first time running detector
	if (!existsSync(path.join(projectRoot,  PREV_DECLARATION_PATH))) {
		declarationSnapShotMaker({ projectRoot, declarationFiles });
	} else {
		const validationResult = areDeclareFilesValid({ projectRoot, declarationFiles });
		if(validationResult.isValid) {
			declarationSnapShotMaker({ projectRoot, declarationFiles });
		} else {
			console.log(validationResult.info);
		}
	}
}
