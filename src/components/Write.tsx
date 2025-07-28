const Write = () => {
  return (
    <div>
      <div className="post-form">
        <h3 className="section-title">📍오늘 나의 가차차</h3>
        <form>
          <div className="form-group">
            <label className="form-label">가챠샵 위치</label>
            <input
              type="text"
              className="form-control"
              placeholder="예: 강남역 가챠샵"
            />
          </div>
          <div className="form-group">
            <label className="form-label">득템 내용</label>
            <textarea
              className="form-control"
              placeholder="어떤 가챠를 득템했나요?"
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">사진 업로드</label>
            <input type="file" className="form-control" accept="image/*" />
          </div>
          <button type="submit" className="btn primary">
            게시하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Write;
