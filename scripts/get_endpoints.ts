import { readdir } from "fs/promises";

/**
 * @description Function to dynamically list all existing endpoints
 * @param path relative path to the /pages dir
 * @returns array of paths
 */
const getEndpoints = async (path: string): Promise<string[] | undefined> => {
	try {
		if (!path) {
			throw TypeError("Path parameter is undefined.");
		}
		return await readdir(path);
	} catch (err) {
		console.error(err);
	}
};

const endpoints = getEndpoints("../pages");
export default endpoints;
