import { Request, Response } from "express";
import User from "../models/user.model";

const getProfile = async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.findById(userId).select("username email isVerified");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        success: true,
        data: user,
    })
}

export default getProfile;