import test from "node:test";
import assert from "node:assert/strict";
import { directoryModules, filterDirectory, validateDirectory } from "../src/directory.mjs";

test("directory is original, unique and explicitly signals missing content", () => {
  assert.deepEqual(validateDirectory(directoryModules), []);
  assert.ok(directoryModules.length >= 12);
  assert.ok(directoryModules.every((entry) => entry.state === "DEMO" || entry.state === "EMPTY"));
  assert.ok(directoryModules.every((entry) => !("items" in entry) && !("sourceData" in entry)));
});

test("directory filter finds module by its own copy, ignoring case", () => {
  assert.equal(filterDirectory(directoryModules, "VeHiClEs")[0].id, "vehicles");
  assert.equal(filterDirectory(directoryModules, "  CHECKLIST  ")[0].id, "checklists");
  assert.deepEqual(filterDirectory(directoryModules, "term-that-does-not-exist"), []);
});

test("directory validation catches duplicate IDs and unrecognized states", () => {
  assert.ok(validateDirectory([...directoryModules, directoryModules[0]]).length > 0);
  assert.ok(validateDirectory([{ ...directoryModules[0], state: "PUBLISHED" }]).length > 0);
});
