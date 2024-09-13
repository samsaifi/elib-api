import { User } from "../user/userType";
export interface Book {
    _id: string;
    title: string;
    author: User;
    genre: string;
    coverImage: string;
    file: string;
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
}
