import { Effect, Schema } from "effect";

const ChildFilter = Schema.TemplateLiteralParser(
  Schema.Number,
  Schema.Literal("-"),
  Schema.Number,
).pipe(
  Schema.filter(
    (input) =>
      !/([0-9]+?)\1/.test(String(input)) ||
      "This ID smells like it was made by a child elf.",
  ),
);

const main = Effect.fn("main")(function* (Input: string) {
  const parts = Input.split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  yield* Effect.forEach(parts, (n, index) =>
    Schema.decodeUnknown(ChildFilter)(n),
  );
});
