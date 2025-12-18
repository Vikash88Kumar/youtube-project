import mongoose, { Schema } from "mongoose";
const likeSchema=new mongoose.Schema(
    {
        likedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"Tweet"
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    },
    {timestamps:true}
)

likeSchema.index(
    { likedBy: 1, video: 1,tweet:1, comment:1 },
    { unique: true }
)

export const Like=mongoose.model("Like",likeSchema)