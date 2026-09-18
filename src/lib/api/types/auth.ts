import type { User } from "./users";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
