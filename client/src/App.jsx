import React from "react";
import { useEffect } from "react";

const App = () => {
useEffect(() => {
  fetch("http://localhost:8000")
    .then(res => res.text())
    .then(data => console.log("Backend Response:", data))
    .catch(err => console.error("Fetch Error:", err));
}, []);


  return <div></div>;
};

export default App;
