import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
    })
})

app.use("/api/auth", authRoutes)


export default app;

