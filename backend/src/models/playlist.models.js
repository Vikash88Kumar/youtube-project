import mongoose, { Schema } from "mongoose";
const playlistSchmea=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,
            default:""
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        videos:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],
        visibility: {
            type: String,
            enum: ["public", "unlisted", "private"],
            default: "public",
        },
    },
    {timestamps:true}
)
export const Playlist=mongoose.model("Playlist",playlistSchmea)