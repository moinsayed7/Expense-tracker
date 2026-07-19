import getCurrentUser from "./lib/checkUser";
import { prisma } from "./lib/prisma";
import DeleteButton from "./deleteButton/deleteButton";  

export function GeneralPage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-2xl">
        Welcome to Expense Tracker
      </h1>

      <div>
        This is a website which lets you keep track of your expenses so you
        never get broke
      </div>

      <div>
        <ul>
          Features
          <li>Check total, mothly, yearly expenses</li>
          <li>Easily edit expenses</li>
          <li>Describe your expenses</li>
          <li>Easy to use </li>
        </ul>
      </div>

      <div>

        <a href="/login">
        <button>Get Started</button>
        </a>
      </div>
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
    return <div>Something went wrong. Please try logging in again.</div>;
}

  const expenses = await prisma.expense.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

    const totalExp = expenses.reduce((sum, ele) => sum + ele.amount, 0);
    

  return (
    <div className="flex flex-col items-center ">
      Your EmailId is {currentUser.email}

      {expenses.length < 1 && <div>You dont have any expense</div>}

      {expenses.length > 0 && (
        <div className="bg-blue-200 mt-5 flex flex-col w-[90%] h-40 px-4 py-4 rounded-2xl">
          <p className="text-left text-2xl font-bold">Total Expense</p>
          <p className="text-xl">₹{(totalExp / 100).toFixed(2)}</p>
        </div>
      )}

      <div className="w-[100%] flex flex-col items-center mt-5">
        {expenses.map((ele) => {
          return (
            <div
              key={ele.id}
              className="flex w-[90%] bg-green-300 mt-2 justify-between items-center px-3 py-2 rounded-2xl"
            >
              <div>
                <div className="font-bold">{ele.category}</div>
                <div>{ele.description}</div>
              </div>

              <div className="flex items-center">
                
                ₹{(ele.amount / 100).toFixed(2)}

                <DeleteButton expenseId={ele.id}/>


              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}