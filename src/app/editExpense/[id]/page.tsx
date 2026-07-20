import getCurrentUser from "@/app/lib/checkUser";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import EditForm  from "./EditForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const expenseId = Number(id);
  if (isNaN(expenseId)) {
    return <div>Invalid expense id</div>;
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId: Number(session.id),
    },
  });

  if (!expense) {
    return <div>Expense not found</div>;
  }

  return <EditForm expense={expense} />;
}