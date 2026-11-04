import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./dashboard-loader.mjs", import.meta.url);
