import * as path from "node:path";
import { generate } from "ts-kun";

generate(path.resolve(__dirname, "src", "sample.ts"));
