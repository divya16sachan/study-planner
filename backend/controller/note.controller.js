import Note from "../model/note.model.js";

export const createNote = async (req, res) => {
    const { name, collectionId } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    try {
        const note = await Note.create({ name, collectionId, userId: user._id });
        res.status(201).json({ message: "note created successfully", note })
    } catch (error) {
        console.log("Error in createNote controller\n", Error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteNote = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        res.status(400).json({ message: "Note_id not provided" });
    }

    try {
        await Note.findByIdAndDelete(_id);
        res.status(200).json({message: `Note: ${Note.name} Deleted successfully`});
    } catch (error) {
        console.log("Error in deleteNote controller\n", Error);
        res.status(500).json({ message: "Internal server error" });
    }
}