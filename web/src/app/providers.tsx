"use client";

import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <JotaiProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </JotaiProvider>
  );
}
