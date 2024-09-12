import * as path from "node:path";
import { generateValidation } from "ts-kun";

generateValidation({
  inputFilePaths: [
    path.resolve(__dirname, "samples", "sampleUser1.ts"),
    path.resolve(__dirname, "samples", "sampleUser2.ts"),
  ],
  outFilePath: path.resolve(__dirname, "samples", "sampleValidate.ts"),
});
