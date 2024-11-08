"use client";

import { Button } from "@/catalyst/button";
import { SunIcon } from "@heroicons/react/16/solid";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="app-button cursor-pointer"
      // @ts-ignore
      outline={true}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
