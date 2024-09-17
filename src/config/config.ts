import { config as conf } from "dotenv";
conf();
const _config = {
    port: process.env.PORT,
    mongo_db: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwt: process.env.JWT_SECRET,
    cloudinary: {
        name: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUD_API_KEY,
        apiSecret: process.env.CLOUD_API_SECRET,
    },
    frontendDomain: process.env.FRONTEND_DOMAIN,
};
export const config = Object.freeze(_config);
