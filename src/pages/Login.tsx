import "../styles/Login.css";

interface LoginProps {
  onClickAuth: () => void;
}

const Login = ({ onClickAuth }: LoginProps) => {
  const onClickGoogleLogin = () => {
    onClickAuth();
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <div className="login-content">
          <p className="login-subtitle">가챠 커뮤니티에 오신걸</p>
          <p className="login-subtitle">환영합니다! 🎉</p>
          <p className="login-description">
            구글 계정으로 간편하게 로그인하고
            <br />
            나의 가챠를 공유해보세요!
          </p>

          <button className="google-login-btn" onClick={onClickGoogleLogin}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
            Google 로그인
          </button>
        </div>

        <div className="login-image">
          <div className="gacha-machine">
            <div className="machine-body">
              <div className="machine-screen">
                <div className="gacha-items">
                  <span className="gacha-item">🧸</span>
                  <span className="gacha-item">🦄</span>
                  <span className="gacha-item">🐱</span>
                  <span className="gacha-item">⭐</span>
                </div>
              </div>
            </div>
            <div className="machine-bottom">
              <div className="machine-handle">🕹️</div>
            </div>
          </div>

          <div className="floating-items">
            <span className="floating-item item-1">✨</span>
            <span className="floating-item item-2">🌟</span>
            <span className="floating-item item-3">💎</span>
            <span className="floating-item item-4">🎈</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
