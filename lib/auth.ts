import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins"
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database(process.env.AUTH_DB_PATH ?? "./sqlite.db"),
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "backend",
            clientId: "test-client-id",
            clientSecret: "test-client-secret",
            authorizationUrl: "http://localhost:5035/authorize",
            tokenUrl: "http://localhost:5035/token",
            userInfoUrl: "http://localhost:5035/userinfo",
            pkce: true,
          }
        ]
      })
    ]
})
