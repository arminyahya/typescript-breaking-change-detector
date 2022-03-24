export function getFullFileName(str) {
	return str.split(/(\\|\/)/g).pop()
}