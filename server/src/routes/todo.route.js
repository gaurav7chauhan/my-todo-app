import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getSingleTodo,
  toggleTodoStatus,
  updateTodo,
} from "../controllers/todo.controller.js";

const todoRoute = Router();

todoRoute.route("/").post(createTodo).get(getAllTodos);

todoRoute.route("/:id").get(getSingleTodo).patch(updateTodo).delete(deleteTodo);

todoRoute.patch("/:id/toggle", toggleTodoStatus);

export default todoRoute;
