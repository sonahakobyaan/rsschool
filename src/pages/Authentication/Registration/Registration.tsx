import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { message } from "antd";
import { api } from "@/api/api";
const Registration = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [login, setLogin] = useState("");
  const [street, setStreet] = useState("");
  const [payment, setPayment] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [houseNumber, setHouseNumber] = useState<number | "">("");

  useEffect(() => {
    const valid =
      login.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword &&
      city &&
      street &&
      houseNumber &&
      payment;
    setIsDisabled(!valid);
  }, [login, password, confirmPassword, city, street, houseNumber, payment]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await api.handleRegister({
      login: login.trim(),
      password,
      confirmPassword,
      city,
      street,
      houseNumber: Number(houseNumber),
      paymentMethod: payment as "cash" | "card",
    });

    if (result.success) {
      message.success("Account created successfully!");
      navigate("/login");
    } else {
      message.error(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="sections">
      <div className="registration-container">
        <h2 className="about-h1">Registration</h2>
        <form
          className="registration-container"
          onSubmit={handleRegisterSubmit}
        >
          <div className="label-row">
            <label className="label">
              Login
              <input
                type="text"
                placeholder="Login"
                className="input-login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </label>

            <label className="label">
              Password
              <input
                type="password"
                placeholder="Password"
                className="input-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="label">
              Confirm Password
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-login"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>

          <div className="label-row second-row">
            <label className="label">
              City
              <select
                className="input-login"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select city</option>
                <option value="CityA">Riverdale Heights</option>
                <option value="CityB">Aurora Bay</option>
                <option value="CityC">Oakstone City</option>
              </select>
            </label>

            <label className="label">
              Street
              <select
                className="input-login"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              >
                <option value="">Select street</option>
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
            </label>

            <label className="label">
              House Number
              <input
                type="number"
                min={1}
                className="input-login"
                value={houseNumber}
                onChange={(e) => setHouseNumber(Number(e.target.value))}
              />
            </label>

            <div className="payment-by-container">
              <legend>Payment By</legend>
              <div className="radio-container">
                <div>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={payment === "cash"}
                    onChange={(e) => setPayment(e.target.value)}
                  />{" "}
                  Cash
                </div>
                <div>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={payment === "card"}
                    onChange={(e) => setPayment(e.target.value)}
                  />{" "}
                  Card
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isDisabled || isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
