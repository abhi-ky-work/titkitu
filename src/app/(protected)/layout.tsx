type LayoutProps = {
  children?: React.ReactNode,
  session?: any
};

export default function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}