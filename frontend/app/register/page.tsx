"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRegisterType } from "../types/login-type";
import { registerUser } from "../lib/api";
import Link from "next/link";
export default function Register() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserRegisterType>({
    email: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await registerUser(userInfo);

    if (response.ok) {
      // save the token
      console.log(await response.json());
      setError(false);
      router.push("/login");
    } else {
      const data = await response.json();
      setErrorMessage(data.message);
      setError(true);
    }
  };

  return (
    <>
      {error === true && <div>{errorMessage}</div>}
      <form
        id="form"
        method="post"
        onSubmit={handleRegister}
        className="form-style"
      >
        <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={(e) => {
            setUserInfo((prev: UserRegisterType) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <input
          type="text"
          placeholder="name"
          value={userInfo.name}
          onChange={(e) => {
            setUserInfo((prev: UserRegisterType) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={userInfo.password}
          onChange={(e) => {
            setUserInfo((prev: UserRegisterType) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />

        <button className="long-btn">Register</button>
      </form>
      <div className="redirect-link">
        <p>Do u already have an account? </p>
        <Link className="link" href={"/login"}>
          Sign in
        </Link>
      </div>
    </>
  );
}
