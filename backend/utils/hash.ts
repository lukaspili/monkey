import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
}
