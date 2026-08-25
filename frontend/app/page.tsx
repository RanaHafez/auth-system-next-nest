"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
export default function Home() {
  const router = useRouter();
  const { user, token, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!token || !user) {
      router.replace("/login");
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>

      <button className="long-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
