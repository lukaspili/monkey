import { FlowException } from "#exceptions/flow_exception";

export function generateInitials(name: string): string {
  name = name.trim();

  if (name.length < 2) {
    throw new FlowException("Invalid name.");
  }

  // Split the name by spaces to get individual words
  const words = name.split(/\s+/);

  // If there's only one word, return the first two letters
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  // Get the first letter of each word
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  // If the initials array has more than 2 letters, take only the first two
  return initials.slice(0, 2).join("");
}
