import "../styles/TabNavigation.css";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="tabs">
      <button
        className={`tab ${activeTab === "feed" ? "active" : ""}`}
        onClick={() => setActiveTab("feed")}
      >
        📸 피드
      </button>
      <button
        className={`tab ${activeTab === "map" ? "active" : ""}`}
        onClick={() => setActiveTab("map")}
      >
        🗺️ 지도
      </button>
    </div>
  );
};

export default TabNavigation;
