import React from "react";
import { useEffect } from "react";
import Login from "./pages/Login";
import CreateTodo from "./pages/CreateTodo";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import EditTodo from "./pages/EditTodo";
import SingleTodo from "./pages/SingleTodo";
import TodoList from "./pages/TodoList";
import Otp from "./pages/Otp";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import UserProfile from "./pages/UserProfile";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EntryPage from "./pages/EntryPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/update-profile" element={<UpdateUserProfile />} />
        <Route path="/create-todo" element={<CreateTodo />} />
        <Route path="/todo" element={<SingleTodo />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/edit-todo" element={<EditTodo />} />
      </Routes>
    </>
  );
};

export default App;
