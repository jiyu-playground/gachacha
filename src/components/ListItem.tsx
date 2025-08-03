import "../styles/ListItem.css";
import type { postType } from "./List";

type ListItemProps = postType & {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const ListItem = ({
  id,
  image,
  text,
  createdAt,
  spot,
  onEdit,
  onDelete,
}: ListItemProps) => {
  return (
    <div className="post-card">
      <div className="post-controls">
        <button onClick={() => onEdit(id)}>수정</button>
        <button onClick={() => onDelete(id)}>삭제</button>
      </div>
      {image && <img className="post-image" src={image} />}
      <div className="post-body">
        <div className="post-text">{text}</div>
        <div className="post-footer">
          <div className="post-actions">
            {/* 시간 괜찮을 때 기능 확장 예정 */}
            {/* <button className="action-btn">❤️ 7</button> */}
            {/* <button className="action-btn">💬 2</button> */}
            <span>📍 {spot}</span>
          </div>
          <span>{`${createdAt}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
