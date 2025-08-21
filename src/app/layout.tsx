import "../styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthProvider";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";

export const metadata: Metadata = {
  title: "가차차! - 전국 가챠샵 찾기",
  description:
    "내 주변 가챠샵을 쉽게 찾아보세요. 전국 가챠샵 위치 정보와 가챠 득템 후기를 공유하는 커뮤니티",
  keywords: "가챠샵, 캡슐토이, 피규어, 가챠폰, 가챠가챠",
  authors: [{ name: "가차차" }],
  openGraph: {
    title: "가차차! - 전국 가챠샵 찾기",
    description: "내 주변 가챠샵을 쉽게 찾아보세요",
    url: "https://gachacha.co.kr",
    siteName: "가차차",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "가차차 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div id="root">
            <Header />
            <TabNavigation />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
