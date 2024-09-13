import { config as conf } from "dotenv";
import { mongo } from "mongoose";
conf();
const _config = {
    port: process.env.PORT,
    mongo_db: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
};
export const config = Object.freeze(_config);
