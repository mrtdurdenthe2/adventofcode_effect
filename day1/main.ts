import { Effect, Schema, Data } from "effect";

const tries = [
  "L68",
  "L30",
  "R48",
  "L5",
  "R60",
  "L55",
  "L1",
  "L99",
  "R14",
  "L82",
];

const Input = Schema.TemplateLiteralParser(
  Schema.Literal("R", "L"),
  Schema.NumberFromString,
);

const main = Effect.gen(function* () {
  yield* Effect(Effect.partition(tries, (n: string) => {
    Schema.decodeUnknown(Input)(n);
  })
);

console.log(Schema.decodeUnknown(Input)("L68"));
