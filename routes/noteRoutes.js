const express = require("express");
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  revertToVersion,
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const router = express.Router();

// Protected routes with authMiddleware
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getAllNotes);
router.get("/:noteId", authMiddleware, getNoteById);
router.put(
  "/:noteId",
  authMiddleware,
  permissionMiddleware.isEditor,
  updateNote
);
router.delete(
  "/:noteId",
  authMiddleware,
  permissionMiddleware.isCreator,
  deleteNote
);
router.put(
  "/:noteId/collaborators",
  authMiddleware,
  permissionMiddleware.isCreator,
  addCollaborator
);
router.put("/:noteId/revert/:versionIndex", authMiddleware, revertToVersion);

module.exports = router;
