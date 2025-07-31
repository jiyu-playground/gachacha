import { Link, useLocation, useNavigate } from "react-router-dom";
import gachachaLogo from "../assets/gachachaLogo.jpeg";
import "../styles/Header.css";
import {
  // type User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../../firebase";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const { pathname } = useLocation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [pathname]);

  const onClickAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClickLogout = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to={"/"} className="logo">
          <img src={gachachaLogo} />
          가차차
        </Link>
        <div className="nav-buttons">
          {pathname === "/login" ? (
            <div className="btn primary" onClick={onClickAuth}>
              로그인
            </div>
          ) : (
            <div className="sign-out">
              {userData?.photoURL && (
                <div className="user-actions">
                  <Link className="btn" to={`/write`}>
                    글 쓰기
                  </Link>
                  <img
                    className="user-img"
                    src={userData.photoURL}
                    alt="user photo"
                  />
                </div>
              )}
              <div className="dropdown">
                <span onClick={onClickLogout}>로그아웃</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
