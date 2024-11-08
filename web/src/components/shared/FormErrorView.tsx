import { XCircleIcon } from "@heroicons/react/16/solid";

export default function FormErrorView({ errors }: { errors: string[] }) {
  let title: string;
  if (errors.isEmpty()) {
    title = "An error occured. Please check your information and try again.";
  } else if (errors.length === 1) {
    title = errors[0];
  } else {
    title = "An error occured. Please address the following issues:";
  }

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          {errors.length > 1 && (
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {errors?.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
