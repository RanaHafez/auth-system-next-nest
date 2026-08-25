"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../lib/api";
import { ResetData } from "../types/login-type";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const handleResetPassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setError(true);
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!token) {
      console.log("Missing reset token");
      setError(true);
      setErrorMessage("Problem..");
      return;
    }

    const payload: ResetData = {
      token,
      password,
    };

    const response = await resetPassword(payload);
    const data = await response.json();

    console.log(data);

    if (response.ok) {
      router.push("/login");
      setError(false);
      setErrorMessage("");
    } else {
      setError(true);
      setErrorMessage(data.message);
    }
  };
  return (
    <>
      {error === true && <div>{errorMessage}</div>}
      <form className="form-style" onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="long-btn">Reset Password</button>
      </form>
    </>
  );
}
