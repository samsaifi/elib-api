import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
// types for controllers
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //validate the request
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields must be provided");
        return next(error);
    }
    //process
    //save to db
    //generate token
    //send response
    return res.json({ message: "user created" });
};
export { createUser };
