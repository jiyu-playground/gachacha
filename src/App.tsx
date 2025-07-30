import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Write from "./components/Write";
import "./styles/globals.css";
import "./styles/responsive.css";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write" element={<Write />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
