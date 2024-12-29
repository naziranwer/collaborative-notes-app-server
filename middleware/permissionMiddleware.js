const Note = require("../models/Note"); // Adjust the path to your Note model as necessary

const isEditor = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user.id; // Assuming req.user contains the authenticated user's ID

  try {
    // Find the note by ID
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the user is the creator or has "edit" permission in collaborators
    const isAllowed =
      note.createdBy.toString() === userId ||
      note.collaborators.some(
        (collaborator) =>
          collaborator.userId.toString() === userId &&
          collaborator.permission === "edit"
      );

    if (!isAllowed) {
      return res
        .status(403)
        .json({ error: "You do not have edit permission for this note" });
    }

    next(); // User has permission, proceed to the next middleware/controller
  } catch (error) {
    console.error("Error in isEditor middleware:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const isCreator = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user.id; // Assuming req.user contains the authenticated user's ID

  try {
    // Find the note by ID
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if the user is the creator
    const isAllowed = note.createdBy.toString() === userId;

    if (!isAllowed) {
      return res
        .status(403)
        .json({ error: "You do not have edit permission for this note" });
    }

    next(); // User has permission, proceed to the next middleware/controller
  } catch (error) {
    console.error("Error in isEditor middleware:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { isEditor, isCreator };
