import { useAuth } from "../hooks/useAuth";
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
  userId,
}: ListItemProps) => {
  const { user } = useAuth();

  const formatTimeAgo = (createdAt: string) => {
    if (!createdAt) return "방금 전";

    try {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

      if (diffInHours < 1) return "방금 전";
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      if (diffInHours < 72) return `${Math.floor(diffInHours / 24)}일 전`;
      return new Date(createdAt).toLocaleDateString();
    } catch (error) {
      console.error("시간 계산 오류:", error);
      return "방금 전";
    }
  };

  return (
    <div className="post-card">
      {user?.id === userId && (
        <div className="post-controls">
          <button onClick={() => onEdit(id)}>수정</button>
          <button onClick={() => onDelete(id)}>삭제</button>
        </div>
      )}
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
          <span>{formatTimeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
