import ThemeSwitch from "@/components/shared/ThemeSwitch";
import Image from "next/image";

import logoMonkeyDarkSrc from "public/images/logo-monkey-dark.svg";
import logoMonkeySrc from "public/images/logo-monkey.svg";
import onboardingArt3Src from "public/images/onboarding-art-3.jpg";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="plz-h-full bg-white dark:bg-zinc-900">
      <div className="relative flex min-h-full flex-1">
        <div className="absolute left-10 top-10">
          <ThemeSwitch />
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image src={logoMonkeySrc} className="h-24 w-auto dark:hidden" alt="" />
              <Image src={logoMonkeyDarkSrc} className="hidden h-24 w-auto dark:block" alt="" />
            </div>
            {children}
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={onboardingArt3Src}
            alt=""
          />
        </div>
      </div>
    </main>
  );
}
