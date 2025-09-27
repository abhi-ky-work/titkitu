"use client";

// import { useSession, signIn, signOut } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();
//   console.log("Session Data Home:", session , session?.user);
//   return (
//     <div className="p-6 text-center">
//        <button
//           onClick={() => signIn("keycloak",{ callbackUrl: "/dashboard" })}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Sign In with Keycloak
//         </button>
//     </div>
//   );
// }

import React from "react";
// import Header from "../components/Header";
// import VideoHero from "../components/VideoHero";
import PartnersSection from "./components/PartnersSection";
import Footer from "./components/Footer";
import LandingPageMainSection from "./components/LandingPageMainSection";
// import PopularEventsCarousel from "../components/PopularEventsCarousel";
// import BusinessOnboarding from "../components/BusinessOnboarding";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        {/* <VideoHero /> */}
        <LandingPageMainSection />
        {/* <PartnersSection /> */}

        {/* <PopularEventsCarousel /> */}
        {/* <BusinessOnboarding /> */}
        
        {/* Footer */}
        {/* <Footer /> */}
      </main>
    </div>
  );
}