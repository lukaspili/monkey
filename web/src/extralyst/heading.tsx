import { clsx } from "clsx";

type HeadingProps = { level?: 1 | 2 | 3 | 4 | 5 | 6 } & React.ComponentPropsWithoutRef<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
>;

export function SectionHeading({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...props}
      className={clsx(
        className,
        "text-xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white"
      )}
    />
  );
}
