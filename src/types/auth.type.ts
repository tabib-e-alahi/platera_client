// src/types/auth.ts

export type UserRole =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN"
  | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED";
export type TProviderApprovalStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISession {
  user: IUser;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
  };
}

export type TSessionCheckResponse = {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  hasProviderProfile?: boolean;
  providerProfileStatus?: TProviderApprovalStatus | null;
};