import SessionProvider from "../components/sessionProvider";




export default function ProtectedRootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <div>
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
    
);
}