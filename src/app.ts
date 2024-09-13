import express from "express";
import globalErrorsHandler from "./middleware/globalErrorHandler";
const app = express();
//Routes
app.get("/", (req, res, next) => {
    res.json({
        message: "welcome to elib apis",
    });
});
// global error handler
app.use(globalErrorsHandler);
export default app;
