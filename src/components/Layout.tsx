import Header from "./Header";
import "../styles/Layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
