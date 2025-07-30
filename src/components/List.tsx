import ListItem from "../components/ListItem";
import "../styles/List.css";
import { mockData } from "../assets/mockData";

const List = () => {
  return (
    <div className="feed active">
      {mockData.map((data) => {
        return <ListItem key={data.id} {...data} />;
      })}
    </div>
  );
};

export default List;
