"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "../signoutButton/signOutButton";

export default function NavBar(){

    const pathName= usePathname();

    if(pathName==="/login" || pathName==="/register"){
        return null
    }

    return (
        <nav className="flex justify-between bg-[#1F2937] border-t border-gray-700 w-[100%] px-3 py-2 text-white">
          <div>
          <Link className="pr-2 " href={"/"}>Home</Link>
          <Link className="pl-2 border-l" href={"/addExpense"}>+Add Expense</Link>
          </div>
          <SignOutButton/>
        </nav>
    )

}


