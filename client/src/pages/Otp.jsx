import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Otp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    const payload = {
      username: state.username,
      email: state.email,
      password: state.password,
      otp: state.otp,
    };

    if (state.type === "register") {
      try {
        const res = await fetch("http://localhost:8000/api/v1/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
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
    }
  };
};
return (
  <div>
    <h2>Enter OTP</h2>
    <div>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div>
      <Link to={"/login"}>change email</Link>
      {
        <button disabled={loading} onClick={() => fetchOtp}>
          {loading ? "sending OTP..." : "resend OTP"}
        </button>
      }
    </div>
  </div>
);
export default Otp;
