"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return <Toaster richColors />;
}

// import { Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/16/solid";
// import toast, { Toaster, resolveValue } from "react-hot-toast";

// export default function AppToaster() {
//   return (
//     <Toaster
//       position="top-right"
//       toastOptions={{ duration: 10000 }}
//       containerStyle={{ top: 30, right: 30 }}
//     >
//       {(t) => (
//         <Transition
//           appear
//           show={t.visible}
//           enter="transition-all duration-150"
//           enterFrom="opacity-0 scale-50"
//           enterTo="opacity-100 scale-100"
//           leave="transition-all duration-150"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-75"
//         >
//           <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-zinc-50 shadow-lg ring-1 ring-zinc-950/10 ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
//             <div className="p-4">
//               <div className="flex items-center">
//                 {/* <div className="flex-shrink-0">
//                   <CheckCircleIcon aria-hidden="true" className="size-6 text-zinc-950/50" />
//                 </div> */}
//                 <div className="ml-0 w-0 flex-1">
//                   <p className="text-base/6 font-medium text-zinc-950">
//                     {resolveValue(t.message, t)}
//                   </p>
//                 </div>
//                 <div className="ml-4 flex flex-shrink-0">
//                   <button
//                     type="button"
//                     onClick={() => toast.dismiss(t.id)}
//                     className="inline-flex rounded-md text-zinc-950 hover:text-zinc-950/50 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:ring-offset-2"
//                   >
//                     <span className="sr-only">Close</span>
//                     <XMarkIcon aria-hidden="true" className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Transition>
//       )}
//     </Toaster>
//   );
// }
