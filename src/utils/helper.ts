import { Request } from "express";
export const coverImageMimeType = (files: any) => {
    return files.coverImage[0].mimetype.split("/").at(-1);
};
