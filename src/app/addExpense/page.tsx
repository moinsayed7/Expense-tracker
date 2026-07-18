"use client";

import { useState } from "react";
import { categoryValidation } from "../lib/expenseValidator";
import { expenseValidation } from "../lib/expenseValidator";
import { z } from "zod";

type ExpenseInput = z.infer<typeof expenseValidation>;

const categoryOptions = categoryValidation.options;

async function sendData(
  data:ExpenseInput
) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amtInPaise = Math.round(Number(amount) * 100);

    let data = {
      category: category,
      amount: amtInPaise,
      description: description,
    };

    const parsed = expenseValidation.safeParse(data);

    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    const result = await sendData(parsed.data);

    if (!result.success) {
      alert(result.error);
      
      return;
    }

    setAmount("");
    setDescription("");
    setCategory("");

    window.location.href = "/";
  }

  return (
    <div >
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
    </div>
  );
}