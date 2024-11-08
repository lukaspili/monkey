import { clsx } from "clsx";

const sizes = {
  base: "text-base/6 sm:text-sm/6",
  lg: "text-base/6 sm:text-base/6",
};

type TextProps = { size?: keyof typeof sizes } & React.ComponentPropsWithoutRef<"p">;

export function Text({ size = "base", className, ...props }: TextProps) {
  return (
    <p
      data-slot="text"
      {...props}
      className={clsx(className, sizes[size], "text-zinc-500 dark:text-zinc-400")}
    />
  );
}
