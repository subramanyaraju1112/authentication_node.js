import { Request, Response } from "express";
import signupUser from "../services/auth.service";

const signupController = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await signupUser({ username, email, password });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal server error"
        })
    }

}

export default signupController;