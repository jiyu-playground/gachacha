import Header from "./Header";
import "../styles/Layout.css";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Header />
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;
