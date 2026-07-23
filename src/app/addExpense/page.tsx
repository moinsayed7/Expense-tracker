"use client";

import { useState } from "react";
import { categoryValidation } from "../lib/expenseValidator";
import { expenseValidation } from "../lib/expenseValidator";
import { z } from "zod";

type ExpenseInput = z.infer<typeof expenseValidation>;

const categoryOptions = categoryValidation.options;

async function sendData(data: ExpenseInput) {
  const response = await fetch("/api/expenses/", {
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

export default function AddExpense() {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    const amtInPaise = Math.round(Number(amount) * 100);

    let data = {
      category: category,
      amount: amtInPaise,
      description: description,
    };

    const parsed = expenseValidation.safeParse(data);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    const result = await sendData(parsed.data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setAmount("");
    setDescription("");
    setCategory("");

    window.location.href = "/";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-blue-200 flex flex-col px-5 py-15 rounded-xl shadow-xl -translate-y-10">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-7 ">
            <label
              className="text-lg max-[370px]:text-sm font-bold"
              htmlFor="amount"
            >
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
            <label
              className="text-lg max-[370px]:text-sm font-bold"
              htmlFor="description"
            >
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

          <div className="mb-7">
            <label
              className="text-lg max-[370px]:text-sm font-bold"
              htmlFor="category"
            >
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
