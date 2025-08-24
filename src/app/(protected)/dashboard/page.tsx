'use client'
// import { getSession } from "next-auth/react"

import {useSession,  signOut } from "next-auth/react";
import { redirect } from "next/navigation";


export default async function HomePage(context: any) {
    const { data: session } = useSession();

    if (!session) {
        redirect("/");
    }
    return (
        <>
        <div className="title">
            Hi !! This Is My Portfolio.
            <div>
               The Environment is : 
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