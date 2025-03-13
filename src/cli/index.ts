import api from "./api";
import { Command } from "commander";

const program = new Command();
program.option("--project, --project <dir>");
program.parse();

export default function cli(): void {
  try {
    const projectRoot = program.getOptionValue("project");
    api({ projectRoot: projectRoot });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
