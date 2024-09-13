import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.files);
    //cloudinary process
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        const coverImageMimeType = files.coverImage[0].mimetype
            .split("/")
            .at(-1);
        const filename = files.coverImage[0].filename;
        const filePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            filename,
        );
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "book-covers",
            format: coverImageMimeType,
        });
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            bookFileName,
        );
        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdf",
                format: "pdf",
            },
        );
        console.log(bookFileUploadResult);
    } catch (error) {
        return next(createHttpError(500, "Error while uploading files"));
    }
    //

    res.json({});
};
export { createBook };
