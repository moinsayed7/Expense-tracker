"use client";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ expenseId }: { expenseId: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleDelete() {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setIsMenuOpen(false);
      router.refresh();
    } else {
      const result = await response.json();
      alert(result.error || "Something went wrong");
    }
  }

  async function handleEdit() {
    setIsMenuOpen(false);
    router.push(`/editExpense/${expenseId}`);
  }

  return (
    <div
      className="relative
     flex flex-col"
    >
      <button
        onClick={(eve) => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        <EllipsisVertical />
      </button>

      {isMenuOpen && (
        <div className="absolute  bg-white right-0 border rounded shadow flex flex-col mr-5 mt-3 w-20 ">
          <button
            className="border-b hover:bg-gray-500 hover:text-white p-1 transition duration-200 "
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="hover:bg-gray-500 hover:text-white p-1 transition duration-200 "
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
