'use client'
import EventCard from "@/app/components/EventCard";
import { browseEventsMocks } from "@/lib/mocks";
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
        
        <main className="relative ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    browseEventsMocks.map((event) =>{
                        return <EventCard key={event.id} event={event}></EventCard>
                    })
                }
            </div>
        </main>
    )
}