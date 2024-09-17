import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middleware/authenticate";
import { coverImageMimeType } from "../utils/helper";
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
    } catch (error: any) {
        console.log(error.message);
        return next(createHttpError(500, "Error while uploading files"));
    }
    //delete file
    try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
    } catch (error: any) {
        console.log(error.message);
        return next(createHttpError(500, "Error while delete file "));
    }
    //process
    //@ts-ignore
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
        title,
        genre,
        author: _req.userId,
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
    });
    res.status(201).json({ id: newBook._id });
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    const bookId = req.params.id;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
        return next(createHttpError(404, "Book Not Found"));
    }
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "Unauthorized"));
    }
    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };
    let completeCoverImage = "";
    if (files?.coverImage) {
        const format = coverImageMimeType(files);
        const filename = files.coverImage[0].filename;
        const filePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            filename,
        );
        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "book-covers",
            format,
        });
        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
    }
    let completeFileName = "";
    if (files.file) {
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            bookFileName,
        );
        completeFileName = bookFileName;
        const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: completeFileName,
            folder: "book-pdf",
            format: "pdf",
        });
        completeFileName = uploadResultPdf.secure_url;
        await fs.promises.unlink(bookFilePath);
    }
    //process
    const updatedBook = await bookModel.findOneAndUpdate(
        {
            _id: bookId,
        },
        {
            title,
            genre,
            author: _req.userId,
            coverImage: completeCoverImage
                ? completeCoverImage
                : book.coverImage,
            file: completeFileName ? completeFileName : book.file,
        },
        {
            new: true,
        },
    );
    console.log(updatedBook);
    res.status(201).json(updatedBook);
};
const getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookModel.find();
        return res.status(200).json(book);
    } catch (error) {
        return next(createHttpError(500, "Error while getting books"));
    }
};
export { createBook, updateBook, getBook };
