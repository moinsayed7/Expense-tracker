"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthCard from "../component/AuthCard";
import { loginValidation } from "@/app/lib/registerValidation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<null | string>(null);

  async function handleData(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginValidation.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <AuthCard>
      <h1 className="mb-5 text-2xl">Login</h1>
      <form onSubmit={handleData} className="">
        <input
          className="border border-gray-400 px-4 py-1 mb-4 w-full"
          type="text"
          value={email.trim()}
          id="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          className="border border-gray-400 px-4 py-1 mb-4 w-full"
          value={password}
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white shadow-xl rounded-lg px-4 py-1 mb-4 w-full hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p className="mt-2 text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-900 underline">
          Sign Up
        </a>
      </p>

      {error && <p className="text-red-500">{error}</p>}
    </AuthCard>
  );
}

// email: 
// test@examp.com
// pass:
//  test@examp.com
