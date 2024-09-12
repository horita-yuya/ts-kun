import { validate } from "./generated-t-sample";

console.log(validate("User", {}));
console.log(validate(null));
console.log(validate(undefined));

const hoge = {};

let k: User;

if (validate("User", hoge)) {
  hoge.name;
}
