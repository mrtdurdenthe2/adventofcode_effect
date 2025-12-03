import { Effect, Either, Schema } from "effect";
import { NumberFromString } from "effect/Schema";

const elves =
  "1061119-1154492,3-23,5180469-5306947,21571-38630,1054-2693,141-277,2818561476-2818661701,21177468-21246892,40-114,782642-950030,376322779-376410708,9936250-10074071,761705028-761825622,77648376-77727819,2954-10213,49589608-49781516,9797966713-9797988709,4353854-4515174,3794829-3861584,7709002-7854055,7877419320-7877566799,953065-1022091,104188-122245,25-39,125490-144195,931903328-931946237,341512-578341,262197-334859,39518-96428,653264-676258,304-842,167882-252124,11748-19561";

const ChildFilter = Schema.TemplateLiteralParser(
  NumberFromString,
  "-",
  NumberFromString,
);

const isCursedId = (n: number) => /^(\d+)\1+$/.test(String(n));

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
