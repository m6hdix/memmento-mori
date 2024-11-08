import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Memento Mori Calendar",
  description:
    "یادآور گذر زمان | تقویمی برای درک بهتر ارزش زمان و زندگی. این تقویم به شما کمک می‌کند تا با نمایش تصویری گذر عمر، لحظات زندگی را با معنای بیشتری سپری کنید و برای رسیدن به اهداف‌تان برنامه‌ریزی کنید.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
