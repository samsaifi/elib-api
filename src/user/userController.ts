import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
//localFiles
import userModel from "./userModel";
import { config } from "../config/config";
import { User } from "./userType";
import { access } from "fs";
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
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }
    //user check is not exists
    let user: User | null;
    try {
        user = await userModel.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User not exists"));
        }
    } catch (error) {
        return next(createHttpError(500, "error while checking user"));
    }
    //verify
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(createHttpError(400, "Credential not match"));
    }
    let token;
    try {
        token = sign({ sub: user._id }, config.jwt as string, {
            expiresIn: "1d",
        });
    } catch (error) {
        return next(createHttpError(500, "error while creating token"));
    }
    res.status(200).json({
        accessToken: token,
    });
};
export { createUser, loginUser };
