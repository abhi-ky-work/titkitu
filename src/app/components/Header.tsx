'use client'
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@/lib/cognitoActions";

export default function Header() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const user = await getCurrentUser();
                if (mounted) setIsAuthenticated(!!user);
            } finally {
                if (mounted) setCheckingAuth(false);
            }
        })();
        return () => { mounted = false };
    }, []);

    const searchSubmitHandler = () =>{
    }

    const signOutHandler = async () =>{
        await signOut();
        setIsAuthenticated(false);
        router.push('/');
    }
    return (
    <header className="bg-white shadow sticky top-0 left-0 right-0 z-50 w-full" >
        <div className="w-10/12 flex items-center justify-between ml-auto mr-auto ">
            {/* haeder container */}
            <div className="w-1/5 px-4 sm:px-6 lg:px-8 flex  items-center h-16">
                <div > <Ticket className="" color="orange" /> </div>
                <div className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent ">TikiTu</div>
            </div>
            <div  className=" border border-black rounded-[8px] h-10">
                {/* search */}
                <form className="flex items-center relative "
                onSubmit={searchSubmitHandler}>
                    <Search  className="text-gray-400" />
                    <input type="text" placeholder="Search events, venues..." className="outline-none p-2 w-96" />
                </form>
            </div>
            <div className="w-1/5 flex items-center justify-between ">
                {!isAuthenticated && (
                    <Button variant="ghost" onClick={ () => router.push('/partnerLogin')} className="m-4 hover:text-purple-600 hover:bg-purple-50">
                        Partner SignIn
                    </Button>
                )}
                {checkingAuth ? null : (
                    isAuthenticated ? (
                        <Button variant="outline" onClick={ signOutHandler} className="m-4 border-purple-200 text-purple-600 hover:bg-purple-50"  >
                            SingOut
                            <LogOut  />
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => router.push('/partnerLogin')} className="m-4 border-purple-200 text-purple-600 hover:bg-purple-50"  >
                            <LogIn  />
                            SignIn
                        </Button>
                    )
                )}
            </div>
            
        </div>
    </header>
  );
}
