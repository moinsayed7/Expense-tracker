"use client"

import { useState } from "react"
import { signUpValidation } from "../lib/registerValidation";
import z from "zod"


type signUp=z.infer<typeof signUpValidation>


async function sendData(data:signUp) {

    const response= await fetch(`/api/register/`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result=await response.json();

    if(!response.ok){
        return {success:false, error:result.error || "Something went wrong"}
    }

    return {success:true, id:result.id}



    
}



export default function SignUpPage() {

    const [email, setEmail]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [error, setError]=useState<string | null>(null);

    async function handleSubmit(e:React.FormEvent){

        e.preventDefault();
        setError(null)

        const data={email:email, password:password};

        const parsed= signUpValidation.safeParse(data);

        if(!parsed.success){
            setError(parsed.error.issues[0].message)
            return 
        }

        const result = await sendData(parsed.data);

        if(!result.success){
            setError(result.error);
            return
        }

        setEmail("");
        setPassword("");

       
        window.location.href= "/login"


    }

    return(
        <div className="flex flex-col items-center ">
            <div className=" flex flex-col items-center border px-7 py-3 mt-9">
            <h1 className="mb-5 text-2xl">Sign Up</h1>
            <form onSubmit={handleSubmit} className="">
                <input className="border px-4 py-1 mb-4 " type="text" value={email} id="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>

                <br />

                <input className="border px-4 py-1" value={password} type="password" id="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>

                <br />

                <button type="submit">Submit</button>
                
            </form>

            <p>already have account ?</p>
            <a href="/login" className="text-blue-900">login</a>

            {error && <p className="text-red-500">{error}</p>}

            </div>

        </div>
    )
    
    
} 


