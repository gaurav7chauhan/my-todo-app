import { verifyJwt } from "../middleware/auth.middleware";
import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getSingleTodo,
  toggleTodoStatus,
  updateTodo,
} from "../controllers/todo.controller";

const router = Router();

router.route("/").post(createTodo).get(getAllTodos);

router.route("/:id").get(getSingleTodo).patch(updateTodo).delete(deleteTodo);

router.patch("/:id/toggle", toggleTodoStatus);

export default todoRoute;
