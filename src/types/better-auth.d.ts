// src/types/better-auth.d.ts

import type { UserRole, UserStatus } from "./auth.type";

declare module "better-auth" {
  interface User {
    role: UserRole;
    status: UserStatus;
    isDeleted: boolean;
    phone: string | null;
  }
}