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

// ✅ Indexes for better performance
todoSchema.index({ owner: 1 });         // Most important
todoSchema.index({ isCompleted: 1 });   // If filtering by complete/incomplete
todoSchema.index({ priority: 1 });      // If filtering by priority
todoSchema.index({ tags: 1 });          // If filtering by tag(s)

// Compound index (optional, based on your query pattern)
todoSchema.index({ owner: 1, _id: 1 });

export const Todo = mongoose.model("Todo", todoSchema);
