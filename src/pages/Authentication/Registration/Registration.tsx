const Registration = () => {
  return (
    <div className="sections">
      <div className="registration-container ">
        <h2 className="about-h1">Registration</h2>
        <form id="registrationForm" className="registration-container">
          <div className="label-row">
            <label className="label">
              Login
              <input
                type="text"
                id="login"
                placeholder="Login"
                className="input-login"
              />
              <span className="error-message" id="loginError"></span>
            </label>

            <label className="label">
              Password
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input-login"
              />
              <span className="error-message" id="passwordError"></span>
            </label>

            <label className="label">
              Confirm Password
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                className="input-login"
              />
              <span className="error-message" id="confirmPasswordError"></span>
            </label>
          </div>
          <div className="label-row second-row">
            <label className="label">
              City
              <select id="city" className="input-login">
                <option value="">Select city</option>
                <option value="CityA">Riverdale Heights</option>
                <option value="CityB">Aurora Bay</option>
                <option value="CityC">Oakstone City</option>
              </select>
              <span className="error-message" id="cityError"></span>
            </label>

            <label className="label">
              Street
              <select id="street" className="input-login">
                <option value="Maplewood Avenue" data-city="CityA">
                  Maplewood Avenue
                </option>
                <option value="Silverbrook Lane" data-city="CityA">
                  Silverbrook Lane
                </option>
                <option value="Pinecrest Boulevard" data-city="CityA">
                  Pinecrest Boulevard
                </option>

                <option value="Oceanview Boulevard" data-city="CityB">
                  Oceanview Boulevard
                </option>
                <option value="Coral Reef Drive" data-city="CityB">
                  Coral Reef Drive
                </option>
                <option value="Lighthouse Crescent" data-city="CityB">
                  Lighthouse Crescent
                </option>

                <option value="Kingsley Street" data-city="CityC">
                  Kingsley Street
                </option>
                <option value="Victoria Avenue" data-city="CityC">
                  Victoria Avenue
                </option>
                <option value="Grandstone Boulevard" data-city="CityC">
                  Grandstone Boulevard
                </option>
              </select>
              <span className="error-message" id="streetError"></span>
            </label>

            <label className="label">
              House Number
              <input
                type="number"
                id="houseNumber"
                min="1"
                className="input-login"
              />
              <span className="error-message" id="houseNumberError"></span>
            </label>

            <div className="payment-by-container">
              <legend>Payment By</legend>
              <div className="radio-container">
                <div>
                  <input type="radio" name="payment" value="cash" /> Cash
                </div>
                <div>
                  <input type="radio" name="payment" value="card" /> Card
                </div>
              </div>
              <span className="error-message" id="paymentError"></span>
            </div>
          </div>

          <button type="submit" id="registerButton" className="login-button">
            Register
          </button>
          <div className="form-error" id="formError"></div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
