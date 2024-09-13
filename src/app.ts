import express from "express";
import globalErrorsHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
const app = express();
//express middleware
app.use(express.json());
//Routes
app.get("/", (req, res, next) => {
    res.json({
        message: "welcome to elib apis",
    });
});
//user Routes
app.use("/api/users/", userRouter);
// global error handler
app.use(globalErrorsHandler);
export default app;
