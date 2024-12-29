const Note = require("../models/Note");

module.exports = (socket, io) => {
  // Join a specific note room
  socket.on("joinNote", async ({ noteId }) => {
    try {
      socket.join(noteId);
      console.log(`User joined note: ${noteId}`);
    } catch (err) {
      console.error("Error joining note room:", err.message);
    }
  });

  // Handle note updates
  socket.on("updateNote", async ({ noteId, content, userId }) => {
    console.log("userId", userId);
    try {
      // Find the note by ID
      const note = await Note.findById(noteId);
      if (!note) {
        console.error("Note not found:", noteId);
        return;
      }

      // Check if the user has edit permissions
      const hasEditPermission =
        note.createdBy.toString() === userId ||
        note.collaborators.some(
          (collaborator) =>
            collaborator.userId.toString() === userId &&
            collaborator.permission === "edit"
        );

      if (!hasEditPermission) {
        console.error("Permission denied for user:", userId);
        socket.emit("error", {
          message: "You do not have permission to edit this note.",
        });
        return;
      }

      // Update the note content and version history
      note.versionHistory.push({
        content: note.content,
        editedBy: userId,
      });
      note.content = content;
      note.updatedAt = new Date();

      await note.save();

      // Emit the updated note to all users in the same room
      io.to(noteId).emit("noteUpdated", { noteId, content });
    } catch (err) {
      console.error("Error updating note:", err.message);
      socket.emit("error", {
        message: "An error occurred while updating the note.",
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};
