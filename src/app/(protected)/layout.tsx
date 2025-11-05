import SessionProvider from "../components/sessionProvider";


type LayoutProps = {
  children?: React.ReactNode,
  session?: any
};

export default function ProtectedRootLayout({
  children,
  // session,
}: {
  children: React.ReactNode;
  // session?: any;
}) {
  return (
    <div>
      <SessionProvider >{children}</SessionProvider>
    </div>
  );
}