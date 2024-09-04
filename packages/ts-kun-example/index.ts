import { validateUser } from "./src/sample";

const user1 = {
  id: 1,
};

const user2 = {
  id: "1",
  name: "John",
};

const user3 = {
  id: 1,
  name: "John",
};

console.log(validateUser({}));
console.log(validateUser(null));
console.log(validateUser(undefined));
console.log(validateUser(user1));
console.log(validateUser(user2));
console.log(validateUser(user3));
