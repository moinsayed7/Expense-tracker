// expense tracker POST and GET

import { NextResponse } from "next/server";
import getCurrentUser from "@/app/lib/checkUser";
import { expenseValidation } from "@/app/lib/expenseValidator";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request:Request) {

        const data= await getCurrentUser();

        if(!data){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        let body:unknown;
        try{
            
            body= await request.json();

        }
        catch{
            return NextResponse.json({error:"Unable to parse the data"}, {status:400})
        }

        const parsed= expenseValidation.safeParse(body);

        if(!parsed.success){
            return NextResponse.json({error:"Wrong data format"}, {status:400})
        }

        try{
            const expense= await prisma.expense.create({
                data:{
                    category:parsed.data.category,
                    description:parsed.data.description,
                    amount:parsed.data.amount,
                    userId:Number(data.id)
                }
            })

            return NextResponse.json({message:"Data created", id:expense.id}, {status:201})
        }
        catch(err){
            
            console.error("POST api/expenses/ FAILED", err)
            return NextResponse.json({error:"Internal server error"}, {status:500})

        }

        
    
}




