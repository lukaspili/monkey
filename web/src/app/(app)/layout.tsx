import AppLayout from "@/components/app-layout/AppLayout";

export default function AppPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
