import { supportPhone } from "@/lib/supportPhone";

test.each([
  ["+55 (85) 99999-1234", "+5585999991234"],
  ["123", "123"],
  ["123?body=outro", null],
  ["123,456", null],
  ["*123#", null],
  [" + ", null],
])("normalizes the support phone %s to %s", (input, expected) => {
  expect(supportPhone(input)).toBe(expected);
});
