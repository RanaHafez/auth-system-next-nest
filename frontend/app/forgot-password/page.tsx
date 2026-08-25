"use client";

import React, { useState } from "react";
import { forgotPassword } from "../lib/api";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const router = useRouter();
  const handleForgotPassword = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const response = await forgotPassword(email);
    if (response.ok) {
      const data = await response.json();
      setError(false);
      const token = data.data.resetToken;
      const resetLink = `/reset-password?token=${token}`;
      router.push(resetLink);
    } else {
      setError(true);
    }
  };
  return (
    <>
      {error === true && <div className="add-text">Error Try Again Later.</div>}
      {error === false && <div className="add-text">Link sent to email</div>}
      <form className="form-style" onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />

        <button className="long-btn">Send Link</button>
      </form>
    </>
  );
}
