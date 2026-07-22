"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryValidation, expenseValidation } from "@/app/lib/expenseValidator";
import { Expense } from "@prisma/client";

const categoryOptions = categoryValidation.options;

export default function EditForm({ expense }: { expense: Expense }) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>((expense.amount / 100).toFixed(2));
  const [description, setDescription] = useState<string>(expense.description ?? "");
  const [category, setCategory] = useState<string>(expense.category);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amountInPaise = Math.round(Number(amount) * 100);
    const data = { category, amount: amountInPaise, description };

    const parsed = expenseValidation.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    const response = await fetch(`/api/expenses/${expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Something went wrong");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
  <div className="bg-blue-200 flex flex-col px-5 py-15 rounded-xl shadow-xl -translate-y-10">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-7 ">
            <label className="text-lg " htmlFor="amount">
              Amount:{" "}
            </label>

            <input
              className=" ml-1 border border-gray-400 px-2 py-1 bg-white"
              value={amount}
              step={"0.01"}
              type="number"
              min={0}
              id="amount"
              placeholder="Enter amount"
              onChange={(eve) => {
                setAmount(eve.target.value);
              }}
            />
          </div>

          <div className="mb-7">
            <label className="text-lg " htmlFor="description">
              Description:{" "}
            </label>

            <input
              className="ml-1 border border-gray-400 px-2 py-1 bg-white"
              value={description}
              type="text"
              id="description"
              placeholder="Enter description"
              onChange={(eve) => {
                setDescription(eve.target.value);
              }}
            />
          </div>

          <div className="text-lg mb-7">
            <label className="" htmlFor="category">
              Category:{" "}
            </label>

            <select
              className="shadow-lg rounded-sm bg-white ml-1"
              id="category"
              value={category}
              onChange={(eve) => {
                setCategory(eve.target.value);
              }}
            >
              <option className="text-center" value={""}>
                Select
              </option>

              {categoryOptions.map((ele) => {
                return (
                  <option
                    key={ele}
                    value={ele}
                    className="text-center text-sm hover:bg-gray-300"
                  >
                    {ele}
                  </option>
                );
              })}
            </select>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            className="bg-green-600 text-lg text-white shadow-lg px-3  rounded-xl self-end hover:bg-green-700"
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}