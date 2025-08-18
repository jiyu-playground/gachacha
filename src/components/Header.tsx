"use client";

import gachachaLogo from "../assets/gachachaLogo.jpeg";
import "../styles/Header.css";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, logout } = useAuth();

  const onClickWrite = () => {
    router.push("/write");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href={"/"} className="logo">
          <img src={gachachaLogo.src} alt="가차차 로그" />
          가차차!
        </Link>
        <div className="nav-buttons">
          {user ? (
            <div className="user-actions">
              {pathname !== "/write" && (
                <Link
                  className="btn primary"
                  href={`/write`}
                  onClick={onClickWrite}
                >
                  글쓰기
                </Link>
              )}
              <div className="sign-out">
                {user?.user_metadata.picture && (
                  <img
                    className="user-img"
                    src={user.user_metadata.picture}
                    alt="user photo"
                  />
                )}
                <div className="dropdown">
                  <span onClick={logout}>로그아웃</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="btn primary" onClick={login}>
              로그인
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
