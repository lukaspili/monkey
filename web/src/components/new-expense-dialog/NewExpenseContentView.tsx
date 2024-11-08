import { createAddUserEmailRequest } from "@/actions/session/email-requests";
import { requestToVerifyAtom } from "@/components/account/emails/EmailTableRowDialogsView";
import { FormSchema, FormValues } from "@/components/new-expense-dialog/schema";
import { FirstStepView } from "@/components/new-expense-dialog/step-1";
import { SecondStepView } from "@/components/new-expense-dialog/step-2";
import { ActionButton } from "@/components/shared/ActionButton";
import { DialogActions, DialogTitle } from "@/extralyst/dialog";
import { formatDate, formatDateForDisplay } from "@/lib/dates";
import { formatAmount } from "@/lib/money";
import { OwnerShareholder } from "@/models/shareholder";
import { useClose } from "@headlessui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Avatar } from "catalyst/avatar";
import { Button } from "catalyst/button";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";

export const Step = {
  First: 1,
  Second: 2,
} as const;

export type Step = (typeof Step)[keyof typeof Step];

type FirstStepValidity = {
  title: boolean;
  amount: boolean;
  date: boolean;
  payers: boolean;
};

export const CurrentStepAtom = atom<Step>(Step.First);
CurrentStepAtom.onMount = (set) => {
  return () => {
    set(Step.First);
  };
};

export const FirstStepValidityAtom = atom<FirstStepValidity>({
  title: false,
  amount: false,
  date: false,
  payers: false,
});
FirstStepValidityAtom.onMount = (set) => {
  return () => {
    set({
      title: false,
      amount: false,
      date: false,
      payers: false,
    });
  };
};

export function NewExpenseContentView({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
    defaultValues: {
      title: "",
      amount: "",
      date: formatDate(new Date()),
      payers: [],
      payees: [],
    },
  });

  const [response, action, pending] = useActionState(createAddUserEmailRequest, null);

  const close = useClose();

  const setEmailRequestToVerify = useSetAtom(requestToVerifyAtom);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      close();
      setEmailRequestToVerify(response.data);
    }
  }, [response, close, setEmailRequestToVerify]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    form.setValue("title", "Restaurant");
    form.setValue("amount", "100");
    // form.setValue("date", formatDate(new Date()));
    // form.setValue("payers", [
    //   {
    //     id: "1",
    //     name: "John Doe",
    //     initials: "JD",
    //   },
    // ]);
  }, []);

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            startTransition(() => {
              action(new FormData(formRef.current!));
            });
          })(evt);
        }}
      >
        <TitleView />

        {/* <DialogBody> */}
        {/* <p className="mt-4">
            Add a new email address to your account. This email, once verified, can be used to login
            to your account.
          </p> */}

        <div className="mt-6">
          <FirstStepView availableShareholders={availableShareholders} />
        </div>

        <div className="mt-6">
          <SecondStepView availableShareholders={availableShareholders} />
        </div>

        <div>
          <FooterView pending={pending} />
        </div>
      </form>
    </FormProvider>
  );
}

const TitleView = () => {
  const { control } = useFormContext<FormValues>();
  const [title, amount, date, payers, payees] = useWatch({
    control,
    name: ["title", "amount", "date", "payers", "payees"],
  });
  const [currentStep, setCurrentStep] = useAtom(CurrentStepAtom);

  if (currentStep === Step.First) {
    return <DialogTitle>Add Expense</DialogTitle>;
  }

  const onClickEdit = () => {
    setCurrentStep(Step.First);
  };

  const payer = payers[0];

  return (
    <div className="px-[--gutter] pt-[--gutter]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <h1 className="text-lg/6 font-semibold text-zinc-950 sm:text-2xl/6 dark:text-white">
              {title}
            </h1>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            {/* <p>Paid by</p> */}
            <div className="flex items-center gap-1">
              <Avatar className="size-5" src={payer.avatar} initials={payer.initials} />
              <p className="font-semibold">{payer.isAccountOwner ? "You" : payer.name}</p>
            </div>
            <p>paid for it - </p>
            <p className="capitalize">{formatDateForDisplay(new Date(date))}</p>
            {/* <span> paid for it {formatDateForDisplay(new Date(date))}</span> */}
          </div>
        </div>
        <p className="text-lg/6 font-semibold text-zinc-950 sm:text-2xl/6 dark:text-white">
          {formatAmount(parseFloat(amount) * 100)}
        </p>
      </div>
      <button className="mt-2 text-sm text-zinc-500 underline" onClick={onClickEdit}>
        Edit
      </button>
    </div>
  );
};

const FooterView = ({ pending }: { pending: boolean }) => {
  return (
    <DialogActions>
      <CloseButton />
      <NextStepButton />
      {/* <SubmitButton pending={pending} /> */}
    </DialogActions>
  );
};

const NextStepButton = () => {
  const {
    formState: { errors },
  } = useFormContext<FormValues>();

  // console.log(errors);

  // const hasErrors = !!errors.title || !!errors.amount || !!errors.date || !!errors.payers;

  const firstStepValid = useAtomValue(FirstStepValidityAtom);
  const hasErrors =
    !firstStepValid.title ||
    !firstStepValid.amount ||
    !firstStepValid.date ||
    !firstStepValid.payers;

  const setCurrentStep = useSetAtom(CurrentStepAtom);

  return (
    <Button disabled={hasErrors} onClick={() => setCurrentStep(Step.Second)}>
      Next
    </Button>
  );
};

function CloseButton() {
  const close = useClose();
  return (
    <Button plain onClick={close}>
      Cancel
    </Button>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <ActionButton type="submit" inProgress={pending}>
      Add
    </ActionButton>
  );
}
