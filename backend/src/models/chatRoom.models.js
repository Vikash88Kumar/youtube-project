import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        isGroup: { //for group chat bydefault false for two member
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);
chatSchema.index({ members: 1 }); //not clear

export const Chat = mongoose.model("Chat", chatSchema);
