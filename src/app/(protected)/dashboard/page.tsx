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
        // <a href="/api/auth/signin">Sign in</a>
        redirect("/api/auth/signin");
    }

    console.log("Session Data in Dashboard:", session, status , session?.user?.name);


    return (
        <>
        <div className="title">
            Welcome to Dashboard
            <div>
               Hi {session?.user?.name }
            </div>
            <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white px-4 py-2 rounded"
            >
            Sign Out
            </button>
        </div>
        </>
    )
}