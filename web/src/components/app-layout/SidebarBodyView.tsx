"use client";

import {
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/catalyst/sidebar";
import { HomeIcon, Square2StackIcon } from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

export default function SidebarBodyView() {
  const pathname = usePathname();

  return (
    <SidebarBody>
      <SidebarSection>
        <SidebarItem href="/" current={pathname === "/"}>
          <HomeIcon />
          <SidebarLabel>Dashboard</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/ledgers" current={pathname.startsWith("/ledgers")}>
          <Square2StackIcon />
          <SidebarLabel>Ledgers</SidebarLabel>
        </SidebarItem>
        {/* <SidebarItem href="/events" current={pathname.startsWith("/events")}>
                <Square2StackIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders" current={pathname.startsWith("/orders")}>
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings" current={pathname.startsWith("/settings")}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem> */}
      </SidebarSection>

      {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href={event.url}>
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection> */}

      <SidebarSpacer />

      {/* <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection> */}
    </SidebarBody>
  );
}
