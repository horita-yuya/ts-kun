import * as path from "node:path";
import { generate } from "ts-kun";
import { validateUser } from "./src/sample";

generate(path.resolve(__dirname, "src", "sample.ts"));

const dummyUser = {
  id: 1,
};

const user = {
  id: 1,
  name: "John",
};

console.log(validateUser(dummyUser));
console.log(validateUser(user));
