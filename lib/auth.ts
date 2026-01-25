import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH] Attempting login...");
          console.log("[AUTH] SERVER URL:", process.env.SERVER);
          console.log("[AUTH] Credentials:", {
            username: credentials.username,
          });

          const res = await fetch(`${process.env.SERVER}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          console.log("[AUTH] Response status:", res.status);

          if (!res.ok) {
            const errorText = await res.text();
            console.error("[AUTH] Login failed:", res.status, errorText);
            return null;
          }

          const user = await res.json();
          console.log("[AUTH] User received:", user);

          if (user && user.id) {
            console.log("[AUTH] Login successful for user:", user.id);
            return user;
          }

          console.error("[AUTH] User object missing id field:", user);
          return null;
        } catch (error) {
          console.error("[AUTH] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
});
