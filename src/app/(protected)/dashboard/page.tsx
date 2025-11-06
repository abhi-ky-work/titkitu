'use client'
// import { getSession } from "next-auth/react"

import {useSession,  signOut, signIn } from "next-auth/react";
import { redirect } from "next/navigation";


export default  function HomePage() {
    // const { data: session , status} =  useSession();

    // if (status === "loading") {
    //     return <div>Loading...</div>;
    // }
    // if (!session) {
    //     console.log("No session found, redirecting to home.");
    //     redirect("/");
    // }

    return (
        <>
        <div className="title">
            Welcome to Dashboard 
            <div>
               Let's Get You Started !!
            </div>
            We need few more details to set up your account.
            

            <div>
               
            </div>
        </div>
        </>
    )
}