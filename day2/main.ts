import { Effect, Either, Schema } from "effect";
import { NumberFromString } from "effect/Schema";

const elves =
  "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

const ChildFilter = Schema.TemplateLiteralParser(
  NumberFromString,
  "-",
  NumberFromString,
);

const isCursedId = (n: number) => /^(\d+)\1$/.test(String(n));

const main = Effect.fn("main")(function* (Input: string) {
  const cursedIDs: number[] = [];

  const parts = Input.split(/\s*,\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  yield* Effect.forEach(
    parts,
    (o) =>
      Effect.sync(() => {
        const decoded = Schema.decodeUnknownEither(ChildFilter)(o);

        if (Either.isRight(decoded)) {
          const [start, , end] = decoded.right;

          for (let id = start; id <= end; id++) {
            if (isCursedId(id)) {
              cursedIDs.push(id);
            }
          }
        } else {
          Effect.fail("Parse failed. shitty programming skills");
        }
      }),
    { discard: true },
  );

  const sum = cursedIDs.reduce((a, b) => a + b, 0);

  console.log("Sum of cheeky IDs:", sum);
});

Effect.runSync(main(elves)); // Sum of cheeky IDs: 1227775554
