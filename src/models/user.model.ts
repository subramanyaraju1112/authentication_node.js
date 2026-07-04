import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    otp?: string;
    otpExpiry?: Date;
    isVerified: boolean;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model<IUser>("User", userSchema)
export default User;