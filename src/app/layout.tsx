import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthProvider";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "My App",
  description: "My App is a...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <div id="root">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
