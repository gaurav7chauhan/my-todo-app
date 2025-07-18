import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");
  useEffect(() => {
    const currentUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/user/current-user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message);
        }
        alert(result?.message);
        navigate("/user");
      } catch (error) {
        setServerMessage(error.message);
      }
    };
                    }, []);
  return <div>UserProfile</div>;
};

export default UserProfile;
