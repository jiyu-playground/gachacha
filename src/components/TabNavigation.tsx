"use client";

import "../styles/TabNavigation.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="tabs">
      <Link href={"/"} className={`tab ${pathname === "/" ? "active" : ""}`}>
        📸 피드
      </Link>
      <Link
        href={"/map"}
        className={`tab ${pathname === "/map" ? "active" : ""}`}
      >
        🗺️ 지도
      </Link>
    </div>
  );
};

export default TabNavigation;
