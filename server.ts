import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";
const startServer = async () => {
    //connect server
    await connectDb();
    const port = config.port || 3000;
    app.listen(port, () => {
        console.log(`listening on port: ${port}`);
    });
};
startServer();
