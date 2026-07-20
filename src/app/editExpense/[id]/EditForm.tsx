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
    <div>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="amount">Amount: </label>

        <input
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

        <br />

        <label htmlFor="description">Description: </label>

        <input
          value={description}
          type="text"
          id="description"
          placeholder="Enter description"
          onChange={(eve) => {
            setDescription(eve.target.value);
          }}
        />

        <br />

        <label htmlFor="category">Choose Category:</label>

        <select
          id="category"
          value={category}
          onChange={(eve) => {
            setCategory(eve.target.value);
          }}
        >
          <option value={""}>Select</option>

          {categoryOptions.map((ele) => {
            return (
              <option key={ele} value={ele}>
                {ele}
              </option>
            );
          })}
        </select>

        <br />

        <button type="submit">Submit</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}