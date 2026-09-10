import { useState } from "react";

function AuthModal({ onLogin, onRegister, authError, clearError }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) return;
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    clearError();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Create Khatabook Account" : "Login to Khatabook"}</h2>
        {authError && <div className="auth-error">{authError}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>
        <div className="auth-toggle">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={toggleMode} className="auth-link-btn">
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={toggleMode} className="auth-link-btn">
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
