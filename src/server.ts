import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

const PORT = Number(process.env.PORT) || 3000;


// Start Server Function
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running in PORT ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server", error)
    }
}

startServer()