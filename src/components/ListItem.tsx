//TODO tiemAgo getTime으로 가져와서 ~시간 전 or ~일 전이라고 작성되어야 함

import type { mockDataType } from "../assets/mockData";
import "../styles/ListItem.css";

const ListItem = ({ emoji, text, timeAgo, spot }: mockDataType) => {
  return (
    <div className="post-card">
      <div className="post-image">{emoji}</div>
      <div className="post-body">
        <div className="post-text">{text}</div>
        <div className="post-footer">
          <div className="post-actions">
            {/* 시간 괜찮을 때 기능 확장 예정 */}
            {/* <button className="action-btn">❤️ 7</button> */}
            {/* <button className="action-btn">💬 2</button> */}
            <span>📍 {spot}</span>
          </div>
          <span>{`${timeAgo}시간 전`}</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
