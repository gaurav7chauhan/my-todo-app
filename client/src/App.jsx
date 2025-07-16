import React from "react";
import { useEffect } from "react";
import Login from "./pages/Login";
import CreateTodo from "./pages/CreateTodo";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <CreateTodo />
      <Login />
      <Register />
    </>
  );
};

export default App;
