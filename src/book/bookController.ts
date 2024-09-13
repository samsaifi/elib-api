import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    // console.log(req.files);
    //cloudinary process
    let filePath, uploadResult;
    let bookFilePath, bookFileUploadResult;
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        const coverImageMimeType = files.coverImage[0].mimetype
            .split("/")
            .at(-1);
        const filename = files.coverImage[0].filename;
        filePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            filename,
        );
        uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "book-covers",
            format: coverImageMimeType,
        });
        const bookFileName = files.file[0].filename;
        bookFilePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            bookFileName,
        );
        bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdf",
            format: "pdf",
        });
        // console.log(bookFileUploadResult);
    } catch (error) {
        return next(createHttpError(500, "Error while uploading files"));
    }
    //delete file
    try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
    } catch (error) {
        return next(createHttpError(500, "error while delete file "));
    }
    //process
    //@ts-ignore
    console.log("user", req.userId);
    const newBook = await bookModel.create({
        title,
        genre,
        author: "66e4097fa836d025a8db1c4b",
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
    });
    res.json({});
};
export { createBook };
