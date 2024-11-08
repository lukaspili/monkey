import AccountDropdownMenu from "@/components/app-layout/AccountDropdownMenu";
import { getSessionUser } from "@/data/session";
import { Avatar } from "catalyst/avatar";
import { Dropdown, DropdownButton } from "catalyst/dropdown";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "catalyst/navbar";

export function AppLayoutNavbar() {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <UserAvatar />
          </DropdownButton>
          <AccountDropdownMenu anchor="bottom end" />
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}

async function UserAvatar() {
  const user = await getSessionUser();
  const avatar = user.avatar?.url;

  return <Avatar initials={user.initials} src={user.avatar?.url} square />;
}
