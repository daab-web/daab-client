import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Login() {
  return (
    <form
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
          });
          redirect("/");
        } catch (error) {
          console.error("Sign in error:", error);
          // You can redirect to an error page or handle it differently
          redirect("/login?error=CredentialsSignin");
        }
      }}
    >
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
