import { existsSync } from "fs-extra";
import path from "path";
import areDeclareFilesValid from "../compare-declare-files";
import declarationSnapShotMaker, { PREV_DECLARATION_PATH } from "../declare-snapshot-maker";

/* eslint-disable @typescript-eslint/no-var-requires */
interface ApiConfig {
  projectRoot: string;
}
export default function api(config: ApiConfig) {
  const { projectRoot } = config;
  const { declarationFiles } = require(path.join(
    projectRoot,
    "./bcdconfig.json"
  ));

	// its first time running detector
	if (!existsSync(path.join(projectRoot,  PREV_DECLARATION_PATH))) {
		declarationSnapShotMaker({ projectRoot, declarationFiles });
	} else {
		if(areDeclareFilesValid({ projectRoot, declarationFiles })) {
			declarationSnapShotMaker({ projectRoot, declarationFiles });
		}
	}
}
