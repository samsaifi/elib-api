import mongoose from "mongoose";
import { Book } from "./bookType";
const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        default: null,
    },
});
export default mongoose.model<Book>("Book", bookSchema);
