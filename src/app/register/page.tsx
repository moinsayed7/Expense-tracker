"use client";

import { useState } from "react";
import { signUpValidation } from "../lib/registerValidation";
import AuthCard from "../component/AuthCard";
import z from "zod";

type signUp = z.infer<typeof signUpValidation>;

async function sendData(data: signUp) {
    const response = await fetch(`/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        return { success: false, error: result.error || "Something went wrong" };
    }

    return { success: true, id: result.id };
}

export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const data = { email: email, password: password };

        const parsed = signUpValidation.safeParse(data);

        if (!parsed.success) {
            setError(parsed.error.issues[0].message);
            return;
        }

        const result = await sendData(parsed.data);

        if (!result.success) {
            setError(result.error);
            return;
        }

        setEmail("");
        setPassword("");

        window.location.href = "/login";
    }

    return (
        <AuthCard>
            <h1 className="mb-5 text-2xl">Sign Up</h1>
            <form onSubmit={handleSubmit} className="">
                <input
                    className="border border-gray-400 px-4 py-1 mb-4 w-full"
                    type="text"
                    value={email}
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
                    Sign Up
                </button>
            </form>

            <p className="mt-2 text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-900 underline">
                    Login
                </a>
            </p>

            {error && <p className="text-red-500">{error}</p>}
        </AuthCard>
    );
}
