import { CurrentStepAtom, Step } from "@/components/new-expense-dialog/NewExpenseContentView";
import { PayeesField } from "@/components/new-expense-dialog/payees-field";
import { FormValues } from "@/components/new-expense-dialog/schema";
import { OwnerShareholder } from "@/models/shareholder";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useFormContext } from "react-hook-form";

export const SecondStepView = ({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) => {
  const currentStep = useAtomValue(CurrentStepAtom);

  return (
    <AnimatePresence initial={false}>
      {currentStep === Step.Second && (
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
      {currentStep === Step.First && (
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
      <div className="mt-6">
        <PayeesField availableShareholders={availableShareholders} />
      </div>
    </div>
  );
};

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
