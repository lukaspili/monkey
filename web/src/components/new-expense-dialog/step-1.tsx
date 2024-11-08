import {
  CurrentStepAtom,
  FirstStepValidityAtom,
  Step,
} from "@/components/new-expense-dialog/NewExpenseContentView";
import { PayersField } from "@/components/new-expense-dialog/payers-field";
import { FormSchemaStep1, FormValues } from "@/components/new-expense-dialog/schema";
import { formatDate } from "@/lib/dates";
import { OwnerShareholder } from "@/models/shareholder";
import { ErrorMessage, Field, Label } from "catalyst/fieldset";
import { Input } from "catalyst/input";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import * as v from "valibot";

export const FirstStepView = ({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) => {
  const currentStep = useAtomValue(CurrentStepAtom);

  return (
    <AnimatePresence initial={false}>
      {currentStep === Step.First && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FirstStepExpandedView availableShareholders={availableShareholders} />
        </motion.div>
      )}
      {currentStep === Step.Second && (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <FirstStepCollapsedView />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FirstStepExpandedView = ({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) => {
  return (
    <div className="">
      <div className="px-[--gutter]">
        <TitleField />
      </div>

      <div className="mt-4 px-[--gutter]">
        <AmountField />
      </div>

      <div className="mt-4 px-[--gutter]">
        <DateField />
      </div>

      <div className="mt-6">
        <PayersField availableShareholders={availableShareholders} />
      </div>
    </div>
  );
};

function TitleField() {
  const name = "title";
  const { register } = useFormContext<FormValues>();

  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];
  const hasError = !!error;

  const value = useWatch<FormValues>({ name });
  const setFirstStepValidity = useSetAtom(FirstStepValidityAtom);

  useEffect(() => {
    const { success: isValid } = v.safeParse(FormSchemaStep1.title, value);
    setFirstStepValidity((state) => ({
      ...state,
      title: isValid,
    }));
  }, [value, setFirstStepValidity]);

  return (
    <Field>
      <Label>Title</Label>
      <Input {...register(name)} type="text" autoComplete="off" invalid={hasError} />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function AmountField() {
  const name = "amount";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  const value = useWatch<FormValues>({ name });
  const setFirstStepValidity = useSetAtom(FirstStepValidityAtom);

  useEffect(() => {
    const { success: isValid } = v.safeParse(FormSchemaStep1.amount, value);
    setFirstStepValidity((state) => ({
      ...state,
      amount: isValid,
    }));
  }, [value, setFirstStepValidity]);

  return (
    <Field>
      <Label>Amount</Label>
      <Input
        {...register(name)}
        type="number"
        autoComplete="off"
        min="1"
        step="any"
        invalid={!!error}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function DateField() {
  const name = "date";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  const value = useWatch<FormValues>({ name });
  const setFirstStepValidity = useSetAtom(FirstStepValidityAtom);

  useEffect(() => {
    const { success: isValid } = v.safeParse(FormSchemaStep1.date, value);
    setFirstStepValidity((state) => ({
      ...state,
      date: isValid,
    }));
  }, [value, setFirstStepValidity]);

  return (
    <Field>
      <Label>Date</Label>
      <Input
        {...register(name)}
        type="date"
        autoComplete="off"
        max={formatDate(new Date())}
        invalid={!!error}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

const FirstStepCollapsedView = () => {
  const { watch } = useFormContext<FormValues>();
  const title = watch("title");
  const date = watch("date");
  const payers = watch("payers", []);

  const amountValue = watch("amount");
  const amount = parseFloat(amountValue) * 100;

  // return (
  //   <div className="flex flex-row items-center justify-between px-[--gutter]">
  //     <div>
  //       <Text>
  //         <Strong> {title}</Strong>
  //       </Text>
  //       <Text>
  //         {formatAmount(amount)} paid by {payers.map((p) => p.name).join(", ")}
  //       </Text>
  //     </div>
  //     <div>
  //       <Button plain className="underline">
  //         Edit
  //       </Button>
  //     </div>
  //   </div>
  // );

  return null;
};
