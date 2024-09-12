import assert from "node:assert";
import test from "node:test";
import { validate } from "./sampleValidate";

test("validate", () => {
  assert(validate("SampleUser1", { name: "test", plan: "free" }));
  assert(validate("SampleUser1", { name: "test", plan: "pro" }));
  assert(validate("SampleUser2", { id: "test", email: "" }));
});

test("validate invalid", () => {
  assert(!validate("SampleUser1", { name: "test" }));
  assert(!validate("SampleUser1", { name: "test", plan: "invalid" }));
  assert(!validate("SampleUser2", { id: "test" }));
  assert(!validate("SampleUser2", { id: "test", email: 1 }));
});
