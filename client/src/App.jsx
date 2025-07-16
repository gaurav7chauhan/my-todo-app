import React from "react";
import { useEffect } from "react";
import Login from "./pages/Login";
import CreateTodo from "./pages/CreateTodo";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <>
      <CreateTodo />
      <Login />
      <Logout />
      <Register />
    </>
  );
};

export default App;
