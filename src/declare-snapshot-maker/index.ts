import { copySync, existsSync, mkdirSync } from "fs-extra";
import path from "path";
import { OPERATION_PATH, PREV_DECLARATION_PATH } from "../constants/filenames";
import { getFullFileName } from "./helper";
const requiredFolders = [OPERATION_PATH, PREV_DECLARATION_PATH];

interface Config {
  projectRoot: string;
  declarationFiles: string[];
}

function makeFolderIfNotExist(folder: string, projectRoot: string) {
  if (!existsSync(path.join(projectRoot, folder))) {
    mkdirSync(path.join(projectRoot, folder));
  }
}

function createOperationFolders(projectRoot: string) {
  requiredFolders.forEach((folder) => makeFolderIfNotExist(folder, projectRoot));
}

export default function declarationSnapShotMaker({ projectRoot, declarationFiles }: Config) {
  createOperationFolders(projectRoot);
  declarationFiles.forEach((file) => {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(projectRoot, PREV_DECLARATION_PATH, file);
    copySync(srcPath, destPath);
  });
}
