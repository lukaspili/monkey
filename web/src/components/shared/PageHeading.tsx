import clsx from "clsx";

export function PageHeading({ className, ...props }: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...props}
      className={clsx(
        className,
        "text-3xl/8 font-medium text-zinc-950 sm:text-3xl/8 dark:text-white"
      )}
    />
  );
}
