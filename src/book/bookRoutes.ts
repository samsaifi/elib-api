import express from "express";
import { createBook, getBook, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middleware/authenticate";
const bookRouter = express.Router();
//
const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/upload"),
    limits: {
        fileSize: 3e7,
    },
});
//routes
bookRouter.post(
    "/",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook,
);
bookRouter.patch(
    "/:id",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    updateBook,
);
bookRouter.get("/:id", getBook);
export default bookRouter;
