import z from "zod"

export const emailCreated=z.string().email()

export const passwordCreated=z.string().min(9,"Min 9 chars required")


export const signUpValidation=z.object(
    {
        email:emailCreated,
        password:passwordCreated
    }
)



export const loginValidation=z.object(
    {
        email:emailCreated,
        password:passwordCreated
    }
)








