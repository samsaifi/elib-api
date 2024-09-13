import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
//localFiles
import userModel from "./userModel";
// types for controllers
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //validate the request
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields must be provided");
        return next(error);
    }
    //check user exists
    const user = await userModel.findOne({ email });
    if (user) {
        const error = createHttpError(400, "Email already exists");
        return next(error);
    }
    //save to db
    const hashedPassword = await bcrypt.hash(password, 10);
    //send response
    return res.json({ message: "user created" });
};
export { createUser };
