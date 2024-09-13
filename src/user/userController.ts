import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
//localFiles
import userModel from "./userModel";
import { config } from "../config/config";
import { User } from "./userType";
// types for controllers
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //validate the request
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields must be provided");
        return next(error);
    }
    try {
        //check user exists
        const user = await userModel.findOne({ email });
        if (user) {
            const error = createHttpError(400, "Email already exists");
            return next(error);
        }
        //save to db
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser: User;
        try {
            newUser = await userModel.create({
                name,
                email,
                password: hashedPassword,
            });
        } catch (error) {
            return next(createHttpError(500, "Error while creating new User"));
        }
        // token generation
        let token;
        try {
            token = sign({ sub: newUser._id }, config.jwt as string, {
                expiresIn: "1d",
            });
        } catch (error) {
            return next(createHttpError(500, "error while creating token"));
        }
        //send response
        return res.status(201).json({
            accessToken: token,
            success: true,
            message: "user created",
        });
    } catch (error) {
        return next(createHttpError(500, "Error while creating user"));
    }
};
export { createUser };
