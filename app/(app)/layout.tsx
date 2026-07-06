import { ProtectedRoute } from "@/src/features/auth/authProvider";

export default function AppRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
