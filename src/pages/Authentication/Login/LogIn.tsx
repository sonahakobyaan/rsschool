import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/api/api";
import { message } from "antd";

const LogIn = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = !login.trim() || !password || isLoading;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await api.handleSignIn({ login: login.trim(), password });
    setIsLoading(true);
    setError("");
    if (result.success) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      message.success("Login successful!");
      navigate("/menu");
      window.location.reload();
    } else {
      setError(result.error);
      message.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="sections">
      <div className="login-container">
        <h2 className="about-h1">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="label-container">
            <label className="label">
              <p>Login</p>
              <input
                type="text"
                placeholder="Login"
                className="input-login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </label>
            <label className="label">
              <p>Password</p>
              <input
                type="password"
                placeholder="Password"
                className="input-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isDisabled || isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
};

export default LogIn;
