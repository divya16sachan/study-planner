import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        isGeneral: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Collection = mongoose.model('collection', collectionSchema);
export default Collection;
