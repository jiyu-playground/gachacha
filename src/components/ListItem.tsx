const ListItem = () => {
  return (
    <div className="post-card">
      <div className="post-image">🐱</div>
      <div className="post-body">
        <div className="post-text">
          헬로키티 신상 나왔네요! 너무 귀여워서 3개 뽑았어요 💕
        </div>
        <div className="post-footer">
          <div className="post-actions">
            {/* 시간 괜찮을 때 기능 확장 예정 */}
            {/* <button className="action-btn">❤️ 7</button> */}
            {/* <button className="action-btn">💬 2</button> */}
          </div>
          <span>1일 전</span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
