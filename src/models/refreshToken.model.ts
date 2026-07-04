import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    revoked?: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    })


const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)
export default RefreshToken