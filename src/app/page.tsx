import getCurrentUser from "./lib/checkUser";
import { prisma } from "./lib/prisma";
import DeleteButton from "./deleteButton/deleteButton";
import Link from "next/link";

export function GeneralPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold mb-10 text-2xl min-[400px]:text-xl mt-7">
        Welcome to Expense Tracker
      </h1>

      <div className="bg-green-300 px-5 py-5 flex items-center w-[85%] rounded mb-10 shadow-xl">
        An Expense Tracker application built with Next.js, React, TypeScript,
        and Tailwind CSS that helps users efficiently manage their personal
        finances. The app includes full CRUD functionality for creating,
        viewing, updating, and deleting expenses, along with secure
        authentication for personalized user accounts. It features a clean,
        responsive UI, organized expense management, and a modern tech stack
        focused on performance, scalability, and a smooth user experience.
      </div>

      <div className="flex flex-col items-center bg-blue-300 text-base px-1 py-10 mb-10 rounded-lg shadow-xl w-[85%] text-wrap">
        <h3 className="font-bold text-xl mb-2">Features</h3>


        <ul className="list-disc max-[470px]:w-[80%]">
          <li> Secure user authentication and account management</li>
          <li>Create, read, update, and delete expenses (CRUD operations)
          </li>
          <li> Track and manage personal expenses easily</li>
          <li> Add expense details like title, amount, category, and date</li>
          <li> Modern and responsive UI built with Tailwind CSS</li>
          <li> Fast performance using Next.js and React</li>
          <li> Protected user data with authentication</li>
          <li> Mobile-friendly responsive design</li>
          <li> Update and manage expenses seamlessly</li>
          <li> Type-safe development with TypeScript</li>
        </ul>
      </div>

        <Link
          href="/login"
          className="bg-red-400 text-white text-lg px-6 py-3 rounded-2xl shadow-2xl hover:bg-red-500 inline-block"
        >
          Get Started
        </Link>
    </div>
  );
}

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <GeneralPage />;
  }

  const userId = Number(currentUser.id);

  if (isNaN(userId)) {
    console.error("Invalid userId in session:", currentUser.id);
    return (
      <div className="text-2xl text-red-800">
        Something went wrong. Please try logging in again.
      </div>
    );
  }

  const expenses = await prisma.expense.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  const totalExp = expenses.reduce((sum, ele) => sum + ele.amount, 0);

  return (
    <div
      className="flex flex-col items-center 
    max-[470px]:text-sm"
    >
      {expenses.length < 1 && (
        <div className="bg-gray-100 mt-5 px-6 py-8 rounded-2xl text-gray-500 text-center w-[90%]">
          You don't have any expenses yet. Add your first one to get started!
        </div>
      )}

      {expenses.length > 0 && (
        <div className="bg-blue-200 mt-5 flex flex-col w-[90%] h-40 px-4 py-4 rounded-2xl">
          <p className="text-left text-2xl font-bold max-[400px]:text-xl">
            Total Expense
          </p>
          <p className="text-xl max-[400px]:text-lg">
            ₹{(totalExp / 100).toFixed(2)}
          </p>
        </div>
      )}

      <div className="w-[100%] flex flex-col items-center mt-5 ">
        {expenses.map((ele) => {
          return (
            <div
              key={ele.id}
              className="flex w-[90%] bg-green-300 mt-2 justify-between items-center px-5 py-2 rounded-lg max-[470px]:text-sm"
            >
              <div>
                <div className="font-bold">{ele.category}</div>
                <div>{ele.description}</div>
              </div>

              <div className="flex items-center justify-center">
                <p> ₹{(ele.amount / 100).toFixed(2)}</p>

                <DeleteButton expenseId={ele.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
