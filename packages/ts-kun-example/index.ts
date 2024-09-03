import * as path from "node:path";
import { generate } from "ts-kun";
import { validatePost, validateUser } from "./src/sample";

generate(path.resolve(__dirname, "src", "sample.ts"));

// @ts-ignore
console.log(validateUser());
// @ts-ignore
console.log(validatePost());
