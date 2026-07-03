import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
    userId: string;
    token: string;
    expiresAt: Date;
    revoked?: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: String,
    },
    token: {
        type: String,
    },
    expiresAt: {
        type: Date,
    },
    revoked: {
        type: Boolean
    }
},
    {
        timestamps: true,
    })


const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)
export default RefreshToken