import { UserAvatar } from "@/models/user-avatar";

type Base = {
  id: string;
};

export type OwnerShareholder = Base & {
  name: string;
  initials: string;
  avatar?: UserAvatar;
  isAccountOwner: boolean;
};
