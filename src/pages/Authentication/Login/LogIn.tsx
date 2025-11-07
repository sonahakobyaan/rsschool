const LogIn = () => {
  return (
    <div className="sections">
      <div className="login-container">
        <h2 className="about-h1">Sign In</h2>
        <div className="label-container">
          <label className="label">
            <p>Login</p>
            <input
              type="text"
              id="login"
              placeholder="Login"
              className="input-login"
            />
            <span className="error-message" id="loginError"></span>
          </label>
          <label className="label">
            <p>Password</p>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="input-login"
            />
            <span className="error-message" id="passwordError"></span>
          </label>
        </div>
        <button className="login-button" id="signInButton" disabled>
          Sign In
        </button>
        <div className="form-error" id="formError">
          Incorrect login or password
        </div>
      </div>
    </div>
  );
};

export default LogIn;
