import assert from "node:assert";
import test from "node:test";
import { validate } from "./sampleValidate";

test("validate", () => {
  assert(validate("SampleUser1", { name: "test", plan: "free" }));
  assert(validate("SampleUser1", { name: "test", plan: "pro" }));
  assert(validate("SampleUser2", { id: "test", age: 1, email: "" }));
});

test("validate invalid", () => {
  assert(!validate("SampleUser1", { name: "test" }));
  assert(!validate("SampleUser1", { name: "test", plan: "invalid" }));
  assert(!validate("SampleUser2", { id: "test" }));
  assert(!validate("SampleUser2", { id: "test", email: 1 }));
});

test("type check", () => {
  const user1: unknown = { name: "test", plan: "free" };
  const user2: unknown = { id: "test", age: 1, email: "" };

  if (validate("SampleUser1", user1)) {
    assert(user1.plan === "free");
  } else {
    assert.fail("Invalid user");
  }

  if (validate("SampleUser2", user2)) {
    assert(user2.age === 1);
  } else {
    assert.fail("Invalid user");
  }
});
