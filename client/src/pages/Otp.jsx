import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Otp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/register");
    } else if (state.type === "login" && (!state.email || !state.password)) {
      navigate("/login");
    } else if (
      state.type === "register" &&
      (!state.email || !state.password || !state.username)
    ) {
      navigate("/register");
    }
  }, [state, navigate]);

  if (!state) return null; // showing null for certain time
  // because upper navigate is async takes time

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerMessage("");

    const payload = {
      email: state.email,
      password: state.password,
      otp: otp,
    };

    if (state.type === "register") {
      payload.username = state.username;

      try {
        const res = await fetch("http://localhost:8000/api/v1/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || "Register Failed");
        }

        setServerMessage(result?.message || "Registeration successfull");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setServerMessage(error.message);
      } finally {
        setLoading(false);
      }
    } else if (state.type === "login") {
      try {
        const res = await fetch("http://localhost:8000/api/v1/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message);
        }

        setServerMessage(result.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        setServerMessage(error.message);
      }
    }
  };
  return (
    <div>
      <h2>Enter OTP</h2>
      <p>
        You are {state.type === "register" ? "registering" : "login"} with this
        email
        <b>{state.email}</b>
      </p>
      <input
        type="text"
        value={otp}
        onChange={handleOtpChange}
        maxLength={4}
        autoFocus
      />
      {serverMessage && <p>{serverMessage}</p>}
      <div>
        <Link to={state.type === "register" ? "/register" : "/login"}>
          change email
        </Link>
        {
          <button disabled={loading} onClick={handleSubmit}>
            {loading ? "Sending OTP..." : "Verify"}
          </button>
        }
      </div>
    </div>
  );
};
export default Otp;
