import Map from "../components/Map";
import List from "../components/List";
import TabNavigation from "../components/TabNavigation";
import { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("map");
  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "map" ? <Map /> : <List />}
    </>
  );
};

export default Home;
