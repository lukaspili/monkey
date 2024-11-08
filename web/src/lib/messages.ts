export const greetUser = (name: string): string => {
  const currentHour = new Date().getHours(); // Get the current hour (0-23)
  let greeting: string;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 23) {
    greeting = "Good evening";
  } else {
    greeting = "Hello"; // Use a neutral greeting for very late hours (11 PM to 5 AM)
  }

  return `${greeting}, ${name}`;
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? `1 ${singular}` : `${count} ${pluralForm}`;
};

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
