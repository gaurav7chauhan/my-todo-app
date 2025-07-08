import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    textInput: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      default: "medium",
    },
    tags: {
      type: [String], //Jaise “Work”, “Personal”, “Urgent”
      default: [],
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
