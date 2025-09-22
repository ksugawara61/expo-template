import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createMobileConfig from "@repo/eslint-config/mobile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createMobileConfig(__dirname);
