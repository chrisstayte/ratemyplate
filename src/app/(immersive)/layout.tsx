export default function ImmersiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none">
      {children}
    </div>
  );
}
