import { NextResponse } from "next/server";
import getCurrentUser from "@/app/lib/checkUser";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await getCurrentUser();
  if (!data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const expenseId = Number(id);
  if (isNaN(expenseId)) {
    return NextResponse.json({ error: "Invalid expense id" }, { status: 400 });
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId: Number(data.id),
    },
  });

  if (!expense) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await prisma.expense.delete({
      where: { id: expenseId },
    });
    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE api/expenses/[id] FAILED", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
