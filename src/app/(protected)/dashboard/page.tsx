'use client'
// import { getSession } from "next-auth/react"

import {useSession,  signOut, signIn } from "next-auth/react";
import { redirect } from "next/navigation";


export default  function HomePage() {
    const { data: session , status} =  useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (!session) {
        console.log("No session found, redirecting to home.");
        redirect("/api/auth/signin");
    }

    return (
        <>
        <div className="title">
            Welcome to Dashboard {session?.user?.name }
            <div>
               Let's Get You Started !!
            </div>
            We need few more details to set up your account.
            

            <div>
                <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-4 py-2 rounded"
                >
                Sign Out
                </button>
            </div>
        </div>
        </>
    )
}