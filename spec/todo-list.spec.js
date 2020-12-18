import { compileNote, updateNote } from "../src/js/todo-list";

test("Does nothing when just regular text.", () => {
  expect(compileNote("hello")).toBe("hello");
});

test("Creates todo list of one item.", () => {
  expect(compileNote("- [ ] foo")).toBe(
    '<ul><li><input type="checkbox" data-checkbox-id="1"> foo</li></ul>'
  );
});

test("Creates todo list of one checked item, lower case x.", () => {
  expect(compileNote("- [x] foo")).toBe(
    '<ul><li><input checked="" type="checkbox" data-checkbox-id="1"> foo</li></ul>'
  );
});

test("Creates todo list of one checked item, upper case x.", () => {
  expect(compileNote("- [X] foo")).toBe(
    '<ul><li><input checked="" type="checkbox" data-checkbox-id="1"> foo</li></ul>'
  );
});

test("Creates todo list of two items", () => {
  expect(compileNote("- [ ] foo\n- [ ] bar")).toBe(
    '<ul><li><input type="checkbox" data-checkbox-id="1"> foo</li><li><input type="checkbox" data-checkbox-id="2"> bar</li></ul>'
  );
});

test("Create empty note on empty input", () => {
  expect(compileNote(null)).toBe("");
  expect(compileNote(undefined)).toBe("");
  expect(compileNote("")).toBe("");
});

test("Creates todo list of one checked item, upper case x.", () => {
  expect(updateNote("- [X] foo", 1)).toBe("- [ ] foo");
  expect(updateNote("- [ ] foo", 1)).toBe("- [x] foo");
});

test("Creates todo list of two items", () => {
  expect(updateNote("- [ ] foo\n- [ ] bar", 2)).toBe("- [ ] foo\n- [x] bar");
  expect(updateNote("- [ ] foo\n- [x] bar", 2)).toBe("- [ ] foo\n- [ ] bar");
});
