import bcrypt from "bcryptjs";
import { env } from "../config/env";
 

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, Number(env.BCRYPT_SALT_ROUNDS));
};

export const comparePassword = async (
  plainText: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};
