export const SeedData: {
  alice: SeedUser;
  john: SeedUser;
} = {
  alice: {
    id: "todo",
    name: "Alice",
    email: "alice@a.com",
    password: "FooBar123",
    shareholders: [],
  },
  john: {
    id: "todo",
    name: "John",
    email: "john@a.com",
    password: "FooBar123",
    shareholders: [],
  },
};

export type SeedUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  shareholderId?: string;
  shareholders: Array<{ id: string; name: string }>;
};
