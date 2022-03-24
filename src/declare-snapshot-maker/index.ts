import { copyFileSync, existsSync, mkdirSync } from "fs-extra";
import { getFullFileName } from "./helper";

export const OPERATION_PATH = "./breaking-change-detector";
export const PREV_DECLARATION_PATH = `${OPERATION_PATH}/prev-declarations`;
const requiredFolders = [OPERATION_PATH, PREV_DECLARATION_PATH];

interface Config {
  declarationFiles: string[];
}

function makeFolderIfNotExist(folder: string) {
	if (!existsSync(folder)) {
    mkdirSync(folder);
  }
}

function createOperationFolders() {
	makeFolderIfNotExist(OPERATION_PATH);
	requiredFolders.forEach(makeFolderIfNotExist);
}

export default function declarationSnapShotMaker({ declarationFiles }: Config) {
  createOperationFolders();
  declarationFiles.forEach((file) => {
    copyFileSync(file, PREV_DECLARATION_PATH + `/${getFullFileName(file)}`);
  });
}
