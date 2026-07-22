"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: "/login" });
      }}
      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
    >
      Sign Out
    </button>
  );
}
