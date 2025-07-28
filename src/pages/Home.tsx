import Layout from "../components/Layout";
import Map from "../components/Map";
import List from "../components/List";
import TabNavigation from "../components/TabNavigation";
import { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("map");
  return (
    <Layout>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "map" ? <Map /> : <List />}
    </Layout>
  );
};

export default Home;
