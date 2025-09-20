"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log("Session Data Home:", session , session?.user);
  return (
    <div className="p-6 text-center">
       <button
          onClick={() => signIn("keycloak",{ callbackUrl: "/dashboard" })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In with Keycloak
        </button>
    </div>
  );
}