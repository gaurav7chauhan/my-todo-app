import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getSingleTodo,
  toggleTodoStatus,
  updateTodo,
} from "../controllers/todo.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const todoRoute = Router();

todoRoute.use(verifyJwt);

todoRoute.route("/").post(createTodo).get(getAllTodos);

todoRoute.route("/:todoId").get(getSingleTodo).patch(updateTodo).delete(deleteTodo);

todoRoute.patch("/:todoId/toggle", toggleTodoStatus);

export default todoRoute;
