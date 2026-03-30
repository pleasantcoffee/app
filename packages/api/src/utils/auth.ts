import { SignJWT } from "jose";
import type { User } from "~/generated/prisma/client";

export const encodeSecret = (secret: string) =>
  new TextEncoder().encode(secret);

export const createJWT = async (
  user: User,
  secret: string,
): Promise<string> => {
  const encodedSecret = encodeSecret(secret);
  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(user.id.toString())
    .setExpirationTime("2h")
    .sign(encodedSecret);

  return jwt;
};
