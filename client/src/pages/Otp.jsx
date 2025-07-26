import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { otpRequest } from "../utils/otp";

const Otp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setLoading(true);

    const { ok, result } = await otpRequest({
      email: state.email,
      type: state.type,
    });

    if (!ok) {
      setLoading(false);
      setServerMessage(result.message);
      setResendTimer(30);
      return;
    }

    setServerMessage(result.message || "OTP resent successfully!");
    setLoading(false);
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  // checking the state is not null
  useEffect(() => {
    if (!state) {
      navigate("/");
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
    setOtp(e.target.value.trim());
  };

  // now handle the OTP
  const handleSubmit = async () => {
    setLoading(true);
    setServerMessage("");
    setMessageType("");

    const payload = {
      email: state.email,
      password: state.password,
      type: state.type,
      otp: otp,
    };

    if (!otp || otp.length !== 4) {
      setLoading(false);
      setServerMessage("Please enter a 4-digit OTP.");
      return;
    }

    // sending api requests for register, login
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
        setMessageType("OTP send successfully");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } catch (error) {
        setServerMessage(error.message);
        setMessageType("something went wrong!");
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
        setMessageType("OTP send successfully");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (error) {
        setServerMessage(error.message);
        setMessageType("something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      {/* Header */}
      <div>
        <h2>Enter OTP</h2>
        <p>
          You are{" "}
          <span>
            {state.type === "register" ? "registering" : "logging in"}
          </span>{" "}
          with
          <br />
          <span>{state.email}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          maxLength={4}
          autoFocus
          placeholder="Enter 4-digit OTP"
        />
      </div>

      {/* Server Message */}
      {serverMessage && (
        <div>
          {messageType === "OTP send successfully" ? (
            <p>Please wait...</p>
          ) : (
            <p>{serverMessage}</p>
            // <p>{otp === "" ? "please enter OTP" : serverMessage}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div>
        <button disabled={loading} onClick={handleSubmit}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button onClick={handleResendOtp} disabled={loading || resendTimer > 0}>
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </button>

        <Link to={state.username ? "/register" : "/login"}>Change email</Link>
      </div>
    </div>
  );
};
export default Otp;
