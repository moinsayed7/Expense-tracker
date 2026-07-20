"use client";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default  function DeleteButton({expenseId}:{expenseId:number}) {
    const [isMenuOpen, setIsMenuOpen]=useState<boolean>(false);
    const router=useRouter()



    async function handleDelete(){

        const response= await fetch(`/api/expenses/${expenseId}`, {
            method:"DELETE",
        })

        if(response.ok){
            setIsMenuOpen(false)
            router.refresh()
        }
        else{
            const result= await response.json();
            alert(result.error || "Something went wrong");
            
        }






    }

    async function handleEdit() {
    setIsMenuOpen(false);
    router.push(`/editExpense/${expenseId}`);
}


    return (

        <div>
            <button onClick={(eve)=>{setIsMenuOpen(!isMenuOpen)}}>
                <EllipsisVertical/>
            </button>

            {isMenuOpen && (
                <div  className="absolute right-0 bg-white border rounded shadow flex flex-col mr-5">
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}

        </div>

        

    )
    
}












