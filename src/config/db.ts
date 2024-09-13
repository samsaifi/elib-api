import mongoose from "mongoose";
import { config } from "./config";
const connectDb = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("connected to db successfully");
        });
        mongoose.connection.on("error", (err) => {
            console.error(`failed to connect: ${err}`);
        });
        await mongoose.connect(config.mongo_db as string);
    } catch (error) {
        console.error(`failed to connect to db: ${error}`);
        process.exit(1);
    }
};
export default connectDb;
