import ListItem from "../components/ListItem";
import "../styles/List.css";

const List = () => {
  return (
    <div className="feed active">
      <ListItem />
      <ListItem />
      <ListItem />
    </div>
  );
};

export default List;
