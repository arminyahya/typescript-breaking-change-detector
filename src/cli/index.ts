import api from "./api"

export default function cli() {
	api({projectRoot: '../..'});
}

cli()