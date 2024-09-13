import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
// types for controllers
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //validate the request
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields must be provided");
        return next(error);
    }
    //save to db
    const user = await userModel.findOne({ email });
    if (user) {
        const error = createHttpError(400, "Email already exists");
        return next(error);
    }
    //process
    const newUser = new userModel({ name, email, password });
    await newUser.save();
    //send confirmation email
    //send verification link (token) to user email
    //send welcome email to new user
    //set token in cookie or JWT token in response header
    //send response with token or jwt token
    //set token in cookie or JWT token in response header
    //send response with token or jwt token
    //send response with token or jwt token
    //set token in cookie or JWT token in response header
    //generate token
    //send response
    return res.json({ message: "user created" });
};
export { createUser };
