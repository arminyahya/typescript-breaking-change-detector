import api from "./api";
import { Command } from "commander";

const program = new Command();
program.option("-project, --project <char>");
program.parse();

export default function cli() {
  const projectRoot = program.getOptionValue("project");
  api({ projectRoot: projectRoot });
}

cli();
