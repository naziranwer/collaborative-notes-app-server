const Note = require("../models/Note");
const User = require("../models/User");

// Create a new note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const newNote = new Note({
      title,
      content,
      createdBy: userId,
      collaborators: [{ userId, permission: "edit" }],
      versionHistory: [
        {
          content,
          editedBy: userId,
        },
      ],
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all notes for the authenticated user
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find notes where the user is either the creator or a collaborator
    const notes = await Note.find({
      $or: [{ createdBy: userId }, { "collaborators.userId": userId }],
    }).populate("createdBy"); // Populate creator's details

    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific note by ID
const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findById(noteId).populate(
      "createdBy collaborators"
    );
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a note's content
const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { content, title } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (content) {
      note.content = content;
      note.versionHistory.push({ content, editedBy: req.user.id });
    }

    if (title) {
      note.title = title;
    }
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    await Note.deleteOne({ _id: noteId });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add collaborators to a note
const addCollaborator = async (req, res) => {
  const { noteId } = req.params;
  const { collaboratorId, permission } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Check if the user is already a collaborator
    const existingCollaborator = note.collaborators.find(
      (collaborator) => collaborator.userId.toString() === collaboratorId
    );

    if (existingCollaborator) {
      return res.status(400).json({ error: "User is already a collaborator" });
    }

    // Add new collaborator with specified permission
    note.collaborators.push({
      userId: collaboratorId,
      permission: permission || "view",
    });
    await note.save();

    res.status(200).json({ message: "Collaborator added successfully" });
  } catch (error) {
    console.error("Error adding collaborator:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Revert to a previous version of the note
const revertToVersion = async (req, res) => {
  const { noteId, versionIndex } = req.params;
  console.log("noteId", noteId, "versionIndex", versionIndex);
  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (versionIndex < 0 || versionIndex >= note.versionHistory.length) {
      return res.status(400).json({ error: "Invalid version index" });
    }

    const previousVersion = note.versionHistory[versionIndex];
    console.log("previousVersion", previousVersion);
    note.content = previousVersion.content;
    await note.save();

    res
      .status(200)
      .json({ message: "Note reverted to previous version", note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  revertToVersion,
};
