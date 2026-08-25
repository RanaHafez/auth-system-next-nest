import type {
  UserLoginType,
  UserRegisterType,
  ResetData,
} from "../types/login-type";

export async function loginUser(userInfo: UserLoginType) {
  const response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  return response;
}

export async function registerUser(userInfo: UserRegisterType) {
  const response = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  return response;
}

export async function forgotPassword(email: string) {
  const response = await fetch("http://localhost:3001/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });
  return response;
}

export async function getProfile(token: string) {
  return fetch("http://localhost:3001/user/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function resetPassword(resetData: ResetData) {
  const response = await fetch("http://localhost:3001/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetData),
  });
  return response;
}
