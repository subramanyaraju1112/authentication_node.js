import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "",
        timestamp: new Date().toISOString(),
    })
})


export default app;

