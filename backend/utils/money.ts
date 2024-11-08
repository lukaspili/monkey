export const formatAmount = (
  amount: number,
  options: { currency: string } = { currency: "$" }
): string => {
  // Handle zero specifically
  if (amount === 0) {
    return `0${options.currency}`;
  }

  // Convert the integer to a string
  const amountStr = Math.abs(amount).toString();

  // Ensure that the string has at least three characters for cents handling
  const paddedAmount = amountStr.padStart(3, "0");

  // Separate the dollars and cents
  const dollars = paddedAmount.slice(0, -2);
  const cents = paddedAmount.slice(-2);

  // Format the amount, omitting decimals if they are zero
  const formattedAmount =
    cents === "00"
      ? `${amount < 0 ? "-" : ""}${dollars}`
      : `${amount < 0 ? "-" : ""}${dollars}.${cents}`;

  return `${formattedAmount}${options.currency}`;
};
