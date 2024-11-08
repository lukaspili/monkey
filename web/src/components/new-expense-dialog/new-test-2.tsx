import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Step, Stepper } from "@/components/ui/stepper"; // Assuming a Stepper component exists
import { Switch } from "@/components/ui/switch";
import { CheckIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

type Participant = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

const participantsList: Participant[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "/avatars/01.png" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "/avatars/02.png" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", avatar: "/avatars/03.png" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", avatar: "/avatars/04.png" },
  { id: 5, name: "Edward Norton", email: "edward@example.com", avatar: "/avatars/05.png" },
  { id: 6, name: "Fiona Apple", email: "fiona@example.com", avatar: "/avatars/06.png" },
  { id: 7, name: "George Clooney", email: "george@example.com", avatar: "/avatars/07.png" },
  { id: 8, name: "Hannah Montana", email: "hannah@example.com", avatar: "/avatars/08.png" },
  { id: 9, name: "Ian McKellen", email: "ian@example.com", avatar: "/avatars/09.png" },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", avatar: "/avatars/10.png" },
];

const CreateExpenseDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1 state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [participantQuery, setParticipantQuery] = useState("");

  // Step 2 state
  const [payers, setPayers] = useState<{ participant: Participant; paidAmount: number }[]>([]);
  const [payersValid, setPayersValid] = useState(true);

  // Step 3 state
  const [splitEqual, setSplitEqual] = useState(true);
  const [useAmounts, setUseAmounts] = useState(false);
  const [splitConfig, setSplitConfig] = useState<{ [key: number]: number }>({});
  const [splitValid, setSplitValid] = useState(true);

  // Validation functions
  const validatePayers = () => {
    const totalPaid = payers.reduce((sum, payer) => sum + payer.paidAmount, 0);
    setPayersValid(totalPaid === parseFloat(amount));
  };

  const validateSplit = () => {
    if (splitEqual) {
      setSplitValid(true);
    } else {
      const total = Object.values(splitConfig).reduce((acc, curr) => acc + curr, 0);
      if (useAmounts) {
        setSplitValid(parseFloat(amount) === total);
      } else {
        setSplitValid(total === 100);
      }
    }
  };

  useEffect(() => {
    validatePayers();
  }, [payers, amount]);

  useEffect(() => {
    validateSplit();
  }, [splitConfig, splitEqual, useAmounts]);

  const handleParticipantSelect = (participant: Participant) => {
    if (selectedParticipants.find((p) => p.id === participant.id)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p.id !== participant.id));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const filteredParticipants = participantsList.filter((participant) =>
    participant.name.toLowerCase().includes(participantQuery.toLowerCase())
  );

  const handleNextStep = () => {
    if (step === 1 && selectedParticipants.length > 0) {
      setStep(2);
    } else if (step === 2 && payersValid && payers.length > 0) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Expense</Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-w-md">
        <h2 className="mb-4 text-xl font-semibold">Create Expense</h2>

        {/* Stepper */}
        {/* <div className="mb-4">
          <Stepper currentStep={step}>
            <Step onClick={() => setStep(1)} completed={step > 1}>
              Details
            </Step>
            <Step onClick={() => step > 1 && setStep(2)} completed={step > 2}>
              Who Paid
            </Step>
            <Step onClick={() => step > 2 && setStep(3)} completed={false}>
              Split
            </Step>
          </Stepper>
        </div> */}

        {/* Step Content */}
        {step === 1 && (
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Expense title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Participants</label>
                <Command className="mt-2">
                  <CommandInput
                    placeholder="Search or add participant..."
                    value={participantQuery}
                    // onChange={(e) => setParticipantQuery(e.target.value)}
                  />
                  <CommandList>
                    <CommandGroup>
                      {filteredParticipants.map((participant) => (
                        <CommandItem
                          key={participant.id}
                          onSelect={() => handleParticipantSelect(participant)}
                        >
                          <Avatar>
                            {participant.avatar ? (
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                            ) : (
                              <AvatarFallback>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-2">
                            <p className="text-sm font-medium">{participant.name}</p>
                            <p className="text-sm text-gray-500">{participant.email}</p>
                          </div>
                          {selectedParticipants.find((p) => p.id === participant.id) && (
                            <CheckIcon className="text-primary ml-auto h-5 w-5" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              {/* Selected Participants */}
              <div>
                {selectedParticipants.length > 0 ? (
                  <div className="flex -space-x-2 overflow-hidden">
                    {selectedParticipants.map((participant) => (
                      <Avatar key={participant.id} className="border-2 border-white">
                        {participant.avatar ? (
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                        ) : (
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No participants selected.</p>
                )}
              </div>
              <div className="flex justify-between">
                <Button disabled>Back</Button>
                <Button
                  onClick={handleNextStep}
                  disabled={
                    !title ||
                    !amount ||
                    selectedParticipants.length === 0 ||
                    parseFloat(amount) <= 0
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Who Paid?</label>
                <div className="mt-2 space-y-2">
                  {selectedParticipants.map((participant) => {
                    const payer = payers.find((p) => p.participant.id === participant.id);
                    return (
                      <div key={participant.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={!!payer}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPayers([...payers, { participant, paidAmount: 0 }]);
                            } else {
                              setPayers(payers.filter((p) => p.participant.id !== participant.id));
                            }
                          }}
                        />
                        <Avatar>
                          {participant.avatar ? (
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                          ) : (
                            <AvatarFallback>
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span>{participant.name}</span>
                        {payers.find((p) => p.participant.id === participant.id) && (
                          <Input
                            type="number"
                            className="w-24"
                            placeholder="Paid Amount"
                            value={
                              payers.find((p) => p.participant.id === participant.id)?.paidAmount ||
                              ""
                            }
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setPayers(
                                payers.map((p) =>
                                  p.participant.id === participant.id
                                    ? { ...p, paidAmount: isNaN(value) ? 0 : value }
                                    : p
                                )
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {!payersValid && (
                  <p className="text-sm text-red-500">
                    Total paid amount must equal expense amount
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <Button onClick={handlePrevStep}>Back</Button>
                <Button onClick={handleNextStep} disabled={payers.length === 0 || !payersValid}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-gray-700">Equal Split</label>
                <Switch
                  checked={splitEqual}
                  onCheckedChange={(checked) => {
                    setSplitEqual(checked);
                    validateSplit();
                  }}
                />
              </div>
              {!splitEqual && (
                <div>
                  <div className="flex items-center space-x-2">
                    <label className="block text-sm font-medium text-gray-700">Use Amounts</label>
                    <Switch
                      checked={useAmounts}
                      onCheckedChange={(checked) => {
                        setUseAmounts(checked);
                        validateSplit();
                      }}
                    />
                  </div>
                  <div className="mt-2 space-y-2">
                    {selectedParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-2">
                        <Avatar>
                          {participant.avatar ? (
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                          ) : (
                            <AvatarFallback>
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span>{participant.name}</span>
                        <Input
                          type="number"
                          className="w-24"
                          placeholder={useAmounts ? "Amount" : "Percentage"}
                          value={splitConfig[participant.id] || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setSplitConfig({
                              ...splitConfig,
                              [participant.id]: isNaN(value) ? 0 : value,
                            });
                            validateSplit();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {!splitValid && (
                    <p className="text-sm text-red-500">
                      {useAmounts
                        ? "Total amount must equal expense amount"
                        : "Total percentage must equal 100%"}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between">
                <Button onClick={handlePrevStep}>Back</Button>
                <Button onClick={handleSubmit} disabled={!splitValid}>
                  Create Expense
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpenseDialog;
