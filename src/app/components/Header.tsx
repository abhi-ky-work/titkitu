'use client'
import { Button } from "@/components/ui/button";
import { LogIn, Search, Ticket } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { redirect } from "next/navigation";
export default function Header() {
    const searchSubmitHandler = () =>{
        
    }
    return (
    <header className=" relative bg-white shadow fixed top-0 left-0 right-0 z-50 glass-effect  w-full" >
        <div className="w-10/12  flex items-center justify-between ml-auto mr-auto "> 
            <div onClick={()=> redirect("/")} className="w-1/5 px-4 sm:px-6 lg:px-8 flex  items-center h-16 ">
                <div > <Ticket size={50} className="" color="orange" /> </div>
                <div className="text-5xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent ">
                    TikiTu
                </div>
            </div>
            <div  className=" border border-black rounded-[8px] h-10 bg-white">
                <form className="flex items-center relative "
                onSubmit={searchSubmitHandler}>
                    <Search  className="text-gray-400" />
                    <input type="text" placeholder="Search events, venues..." className="outline-none p-2 w-96" />
                </form>
            </div>
            <div className="w-1/5 flex items-center justify-between">
                <Button variant="ghost" className="m-4 hover:text-purple-600 hover:bg-purple-50">
                    Browse Events
                </Button>
                <Button variant="outline" onClick={()=> signIn("keycloak",{ callbackUrl: "/dashboard" })} className="m-4 border-purple-200 text-purple-600 hover:bg-purple-50"  >
                    <LogIn  />
                    SignIn
                </Button>

                {/* <Button  variant="outline" className="m-4" >
                SignUp
                </Button> */}
            </div>
            
        </div>
    </header>
  );
}
