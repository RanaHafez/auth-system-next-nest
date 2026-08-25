"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserLoginType } from "../types/login-type";
import { loginUser } from "../lib/api";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { log } from "console";
export default function Login() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserLoginType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await loginUser(userInfo);
    const data = await response.json();
    if (response.ok) {
      // save the token
      console.log(data);

      const token = data.data.access_token;
      console.log(token);
      login(token);
      router.push("/");
      setError(false);
    } else {
      console.log(data);
      setError(true);
      setErrorMessage(data.message);
    }
  };

  return (
    <>
      {error === true && <div>{errorMessage}</div>}
      <form
        id="form"
        method="post"
        onSubmit={handleLogin}
        className="form-style"
      >
        <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={(e) => {
            setUserInfo((prev: UserLoginType) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />

        <input
          type="password"
          placeholder="password"
          value={userInfo.password}
          onChange={(e) => {
            setUserInfo((prev: UserLoginType) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />

        <div className="forgot-password">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <button className="long-btn">Login</button>
      </form>

      <div className="redirect-link">
        <p>You are new instead.</p>
        <Link href={"/register"}>Sign up</Link>
      </div>
    </>
  );
}
