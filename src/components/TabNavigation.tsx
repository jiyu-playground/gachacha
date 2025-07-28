import "../styles/TabNavigation.css";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button
        className={`tab ${activeTab === "map" ? "active" : ""}`}
        onClick={() => setActiveTab("map")}
      >
        🗺️ 지도
      </button>
      <button
        className={`tab ${activeTab === "feed" ? "active" : ""}`}
        onClick={() => setActiveTab("feed")}
      >
        📸 피드
      </button>
    </div>
  );
};

export default TabNavigation;
