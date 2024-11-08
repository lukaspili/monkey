"use client";

import { Link } from "catalyst/link";
import { Strong, Text } from "catalyst/text";

export default function NotFound() {
  return (
    <section>
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
        Wrong place? <br />
        Nothing to be found here.
      </h2>
      <Text className="mt-4">
        Head to{" "}
        <Strong>
          <Link href="/sign-in">sign-in</Link>
        </Strong>{" "}
        or{" "}
        <Strong>
          <Link href="/sign-in">sign-up</Link>
        </Strong>{" "}
        to get started.
      </Text>
    </section>
  );
}
