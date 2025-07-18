import React from "react";
import { useEffect } from "react";
import Login from "./pages/Login";
import CreateTodo from "./pages/CreateTodo";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import EditTodo from "./pages/EditTodo";
import SingleTodo from "./pages/SingleTodo";
import TodoList from "./pages/TodoList";

const App = () => {
  return (
    <>
      <Register />
      <Login />
      <CreateTodo />
      {/* <Logout /> */}
      <EditTodo />
      <SingleTodo />
      <TodoList />
    </>
  );
};

export default App;
