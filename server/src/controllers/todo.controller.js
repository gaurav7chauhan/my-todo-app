import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { todoSchema } from "../validators/todo/todo.validator.js";
import { updateTodoSchema } from "../validators/todo/updatedTodo.validator.js";

export const createTodo = asyncHandler(async (req, res) => {
  const { textInput, title, description, isCompleted, priority, tags } =
    todoSchema.parse(req.body);

  const user = req.user._id;

  const todo = await Todo.create({
    textInput,
    title,
    description,
    isCompleted,
    priority,
    tags,
    owner: user,
  });

  if (!todo) {
    throw new ApiError(500, "Failed to create the todo. Please try again.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, todo, "Your todo has been created successfully.")
    );
});

export const getAllTodos = asyncHandler(async (req, res) => {
  const user = req.user._id;

  //pagination
  const page = parseInt(req.query.page) || 1; // User ne kis page pe click kiya
  const limit = parseInt(req.query.limit) || 4; // Har page pe kitne todos dikhane hain
  const skip = (page - 1) * limit; // Kitne todos skip karne hain DB se

  //sorting
  const sortBy = req.query.sortBy || "createdAt";   // Kis field pe sorting karni hai (e.g., createdAt, priority.)
  const order = req.query.order === "asc" ? 1 : -1;     //asc (1) ya desc (-1)

  const todos = await Todo.find({ owner: user })
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit)
    .select("textInput title isCompleted createdAt")
    .explain("executionStats");

  console.log(result.executionStats.executionStages);

  if (!todos || todos.length === 0) {
    throw new ApiError(404, "No todos found for this user.");
  }

  const totalTodos = await Todo.countDocuments({ owner: user });
  const totalPages = Math.ceil(totalTodos / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page,
        limit,
        totalPages,
        totalTodos,
        todos,
      },
      "Todos fetched successfully."
    )
  );
});

export const getSingleTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const user = req.user._id;

  const todo = await Todo.findOne({ owner: user, _id: todoId });
  if (!todo) {
    throw new ApiError(404, "Todo not found or access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully."));
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const user = req.user._id;

  const { textInput, title, description, priority, tags } =
    updateTodoSchema.parse(req.body);

  const updates = {};

  if (textInput) updates.textInput = textInput;

  if (title) updates.title = title;

  if (description) updates.description = description;

  if (priority) updates.priority = priority;

  if (tags) updates.tags = tags;

  const todo = await Todo.findOneAndUpdate(
    { owner: user, _id: todoId },
    {
      $set: { ...updates },
    },
    { new: true }
  );
  if (!todo) {
    throw new ApiError(404, "Todo not found or not authorized to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { todoId } = req.params;

  const todo = await Todo.findOneAndDelete({ owner: user, _id: todoId });
  if (!todo) {
    throw new ApiError(
      404,
      "Todo not found or you're not authorized to delete it"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Todo deleted successfully"));
});

export const toggleTodoStatus = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { todoId } = req.params;

  const todo = await Todo.findOne({ owner: user, _id: todoId }).select(
    "isCompleted"
  );
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isCompleted = !todo.isCompleted;
  await todo.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo status toggled successfully"));
});
