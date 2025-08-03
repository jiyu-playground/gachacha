import Map from "../components/Map";
import List from "../components/List";
import TabNavigation from "../components/TabNavigation";
import { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("feed");
  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "feed" ? <List /> : <Map />}
    </>
  );
};

export default Home;
