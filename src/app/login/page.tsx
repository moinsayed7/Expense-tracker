"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
        <div>Login 
            <form onSubmit={handleData}>
                <input
                    value={email}
                    type="text"
                    placeholder="Email"
                    onChange={(eve) => setEmail(eve.target.value)}
                />
                <input
                    value={password}
                    type="password"
                    placeholder="Password"
                    onChange={(eve) => setPassword(eve.target.value)}
                />
                <button type="submit">Submit</button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}

// email:user@example.com
// pass:user@example.com

 
