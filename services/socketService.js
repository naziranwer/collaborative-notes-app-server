const Note = require("../models/Note");

module.exports = (socket, io) => {
  socket.on("joinNote", async ({ noteId, user }) => {
    socket.join(noteId);
    socket.name = user.name;
    console.log(` ${user.name} joined note ${noteId}`);

    // Notify other users in the room about the new user
    socket.to(noteId).emit("userJoined", user);

    const activeUsers = Array.from(
      io.sockets.adapter.rooms.get(noteId) || []
    ).map((socketId) => {
      const socket = io.sockets.sockets.get(socketId);

      return { id: socket.id, name: socket.name };
    });

    socket.emit("activeUsers", activeUsers);
  });

  socket.on("leaveNote", ({ noteId, user }) => {
    socket.leave(noteId);
    console.log(`${user.name} left note ${noteId}`);

    // Notify other users in the room about the user leaving
    socket.to(noteId).emit("userLeft", user);
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

  socket.on("cursorPosition", ({ noteId, userId, range }) => {
    console.log("noteId", noteId, "userId", userId, "range", range);
    socket.to(noteId).emit("cursorPosition", { userId, range });
  });
  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};
