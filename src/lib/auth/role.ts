import { type Session } from "next-auth";

export enum UserRole {
  // User = "user",
  Admin = "admin",
}

export const hasRole = <
  TUser extends Partial<Session["user"]>,
  TRole extends UserRole | `${UserRole}`,
>(
  user: TUser,
  role: TRole,
) => {
  return user.role === role;
};
