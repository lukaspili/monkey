// import { FormValues } from "@/components/new-expense-dialog/NewExpenseContentView";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { OwnerShareholder } from "@/models/shareholder";
// import { CheckIcon } from "@heroicons/react/16/solid";
// import { Avatar } from "catalyst/avatar";
// import { useFormContext } from "react-hook-form";

// type NewShareholder = {
//   name: string;
//   initials: string;
// };

// type ShareholderItem = {
//   normalizedId: string;
//   id?: string;
//   name: string;
//   initials: string;
//   avatar?: string;
//   selected: boolean;
// };

// export function ShareholdersField({
//   availableShareholders,
// }: {
//   availableShareholders: OwnerShareholder[];
// }) {
//   const { watch, setValue } = useFormContext<FormValues>();
//   const selectedShareholders = watch("payees", []);

//   // Create a map of selected shareholders for quick lookup
//   const selectedShareholdersMap = new Map(
//     selectedShareholders.map((s) => [s.id ?? s.name.trim().toLowerCase(), s])
//   );

//   const shareholders: ShareholderItem[] = availableShareholders.map((shareholder) => {
//     const normalizedId = shareholder.id ?? shareholder.name.trim().toLowerCase();
//     const isSelected = selectedShareholdersMap.has(normalizedId);
//     return {
//       normalizedId,
//       id: shareholder.id,
//       name: shareholder.isAccountOwner ? `${shareholder.name} (You)` : shareholder.name,
//       initials: shareholder.initials,
//       avatar: shareholder.avatar?.url,
//       selected: isSelected,
//     };
//   });

//   const toggleShareholder = (shareholder: ShareholderItem) => {
//     if (shareholder.selected) {
//       setValue(
//         "payees",
//         selectedShareholders.filter((s) => s.id !== shareholder.id)
//       );
//     } else {
//       setValue("payees", [
//         ...selectedShareholders,
//         {
//           id: shareholder.id,
//           name: shareholder.name,
//           initials: shareholder.initials,
//         },
//       ]);
//     }
//   };

//   return (
//     <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
//       <CommandInput placeholder="Search or add new user..." className="border-none focus:ring-0" />
//       <CommandList>
//         <CommandEmpty>No users found.</CommandEmpty>
//         <CommandGroup className="p-2">
//           {shareholders.map((user) => (
//             <CommandItem
//               key={user.normalizedId}
//               className="flex items-center px-2"
//               onSelect={() => {
//                 toggleShareholder(user);
//               }}
//             >
//               <Avatar
//                 initials={user.initials}
//                 className="size-8 border-none bg-zinc-50 text-xs outline-zinc-100"
//               />
//               <div className="ml-2">
//                 <p className="text-sm font-medium leading-none">{user.name}</p>
//                 {/* <p className="text-muted-foreground text-sm">{user.email}</p> */}
//               </div>
//               {user.selected ? <CheckIcon className="text-primary ml-auto flex h-5 w-5" /> : null}
//             </CommandItem>
//           ))}
//         </CommandGroup>
//       </CommandList>
//     </Command>
//   );
// }
