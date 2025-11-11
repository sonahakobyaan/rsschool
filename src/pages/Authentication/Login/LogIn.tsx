import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { BASE_URL } from "@/api/api";

const LogIn = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsDisabled(!(login.trim() && password.trim()));
  }, [login, password]);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const result = await response.json();

      if (response.status === 201) {
        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        message.success("Login successful!");
        navigate("/menu");
      } else if (response.status === 401) {
        message.error("Incorrect login or password");
      } else {
        message.error(result.error || "Something went wrong. Try again");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
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
