const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["view", "edit"], default: "view" },
      },
    ],
    versionHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        content: { type: String },
        editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // This will auto-manage createdAt and updatedAt
  }
);

module.exports = mongoose.model("Note", NoteSchema);
