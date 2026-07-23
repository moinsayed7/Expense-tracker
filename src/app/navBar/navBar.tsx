"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "../signoutButton/signOutButton";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const pathName = usePathname();
  const { data: session } = useSession();

  if (pathName === "/login" || pathName === "/register") {
    return null;
  }

  if (!session) {
    return (
      <nav className="flex items-center justify-between bg-[#1F2937] border-t border-gray-700 w-[100%] px-3 py-2 text-white max-[400px]:text-xs">
        <div>
          <Link className="pr-2 " href={"/"}>
            Home
          </Link>
        </div>
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition duration-200 "
        >
          Login
        </button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between bg-[#1F2937] border-t border-gray-700 w-[100%] px-3 py-2 text-white  max-[400px]:text-xs">
      <div>
        <Link className="pr-2 " href={"/"}>
          Home
        </Link>
        <Link className="pl-2 border-l" href={"/addExpense"}>
          +Add Expense
        </Link>
      </div>
      <SignOutButton />
    </nav>
  );
}
