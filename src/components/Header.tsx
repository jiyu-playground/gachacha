import { Link, useLocation, useNavigate } from "react-router-dom";
import gachachaLogo from "../assets/gachachaLogo.jpeg";
import "../styles/Header.css";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, login, logout } = useAuth();

  const onClickWrite = () => {
    navigate("/write");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to={"/"} className="logo">
          <img src={gachachaLogo} alt="가차차 로그" />
          가차차!
        </Link>
        <div className="nav-buttons">
          {user ? (
            <div className="user-actions">
              {pathname !== "/write" && (
                <Link
                  className="btn primary"
                  to={`/write`}
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
