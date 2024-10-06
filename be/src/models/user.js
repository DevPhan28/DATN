import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            milength: 6,
        },
        avatar: {
            type: String,
            default: "https://picsum.photos/100/100",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true, versionKey: false }
);
export default mongoose.model("User", UserSchema);
