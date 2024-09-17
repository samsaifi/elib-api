import { Book } from "../book/bookType";
export const coverImageMimeType = (files: any) => {
    return files.coverImage[0].mimetype.split("/").at(-1);
};
export const getCoverImagePublicId = (book: Book) => {
    const coverFileSplit = book.coverImage.split("/");
    return (
        coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".").at(-2)
    );
};
export const getBookImagePublicId = (book: Book) => {
    const bookFileSplit = book.file.split("/");
    return bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
};
