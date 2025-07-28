import { Link } from "react-router-dom";
import gachachaLogo from "../assets/gachachaLogo.jpeg";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={gachachaLogo} />
          가차차
        </div>
        <div className="nav-buttons">
          <Link className="btn primary" to={`/login`}>
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
