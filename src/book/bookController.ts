import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path, { resolve } from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middleware/authenticate";
import {
    coverImageMimeType,
    getBookImagePublicId,
    getCoverImagePublicId,
} from "../utils/helper";
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
    const coverImagePublicId = getCoverImagePublicId(book);
    const bookImagePublicId = getBookImagePublicId(book);
    try {
        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookImagePublicId, {
            resource_type: "raw",
        });
    } catch (error) {
        return next(
            createHttpError(500, "Error while delete files from cloudinary"),
        );
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
const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    // const sleep = await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        const books = await bookModel.find().populate("author", "name");
        return res.status(200).json(books);
    } catch (error) {
        return next(createHttpError(500, "Error while getting books"));
    }
};
const getBook = async (req: Request, res: Response, next: NextFunction) => {
    const sleep = await new Promise((resolve) => setTimeout(resolve, 2000));
    const _id = req.params.id;
    try {
        const book = await bookModel
            .findOne({ _id })
            .populate("author", "name");
        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
        return res.status(200).json(book);
    } catch (error) {
        return next(createHttpError(500, "Error while getting books"));
    }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const book = await bookModel.findOne({ _id });
        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized"));
        }
        const coverImagePublicId = getCoverImagePublicId(book);
        const bookImagePublicId = getBookImagePublicId(book);
        try {
            await cloudinary.uploader.destroy(coverImagePublicId);
            await cloudinary.uploader.destroy(bookImagePublicId, {
                resource_type: "raw",
            });
        } catch (error) {
            return next(
                createHttpError(
                    500,
                    "Error while delete files from cloudinary",
                ),
            );
        }
        await bookModel.deleteOne({ _id });
        return res.sendStatus(204);
    } catch (error) {
        return next(createHttpError(500, "Error while getting books"));
    }
};
export { createBook, updateBook, getBook, getBooks, deleteBook };
