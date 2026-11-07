export interface SessionUser {
  sub: string;
  email: string | null;
  name: string;
  roles: string[];
  scientistId: string | null;
  pictureUrl: string | null;
}

export const isAdmin = (user?: SessionUser | null) =>
  !!user?.roles.includes("admin");

export const isScientist = (user?: SessionUser | null) =>
  !!user?.roles.includes("scientist");
