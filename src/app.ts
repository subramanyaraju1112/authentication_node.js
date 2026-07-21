import express from "express";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import authenticate from "./middlewares/auth.middleware";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
    })
})

app.get("/error", (req, res) => {
    throw new Error("Testing Global Error Handler");
});

// API Routes

app.use("/api/auth", authRoutes)
app.use("/api", authenticate, profileRoutes)
app.use(errorMiddleware)

export default app;

