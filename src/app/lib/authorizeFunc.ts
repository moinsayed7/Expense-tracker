

import { loginValidation } from "./registerValidation";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function authorize(credentials:unknown) {

    const parsed= loginValidation.safeParse(credentials);

    if(!parsed.success){
        return null
    }

    const user = await prisma.user.findUnique({
        where:{
            email:parsed.data.email,
        }
    })

    if(!user) {
        return null
    }

    const isPass=await bcrypt.compare(parsed.data.password,user.password);

    if(!isPass){
        return null
    }

    return ({id: String(user.id) ,email:user.email});
}





