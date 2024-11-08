import { Avatar } from "@/catalyst/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/catalyst/dropdown";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/catalyst/sidebar";
import { SidebarLayout } from "@/catalyst/sidebar-layout";
import AccountDropdownMenu from "@/components/app-layout/AccountDropdownMenu";
import AccountProfileView from "@/components/app-layout/AccountProfileView";
import { AppLayoutNavbar } from "@/components/app-layout/AppLayoutNavbar";
import { AppToaster } from "@/components/app-layout/AppToaster";
import SidebarBodyView from "@/components/app-layout/SidebarBodyView";
import { ChevronDownIcon, ChevronUpIcon, Cog8ToothIcon, PlusIcon } from "@heroicons/react/16/solid";

export default function AppLayout({
  // events,
  children,
}: {
  // events: Awaited<ReturnType<typeof getEvents>>;
  children: React.ReactNode;
}) {
  // let pathname = usePathname();

  return (
    <SidebarLayout
      navbar={<AppLayoutNavbar />}
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="/teams/catalyst.svg" />
                <SidebarLabel>Lazy Monkey</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" src="/teams/catalyst.svg" />
                  <DropdownLabel>Catalyst</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBodyView />

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <AccountProfileView />
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
      <AppToaster />
    </SidebarLayout>
  );
}
