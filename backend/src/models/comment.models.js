import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema=new mongoose.Schema(
    {
        owner:{
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
        content:{
            type:String
        }
    },
    {timestamps:true}
)
commentSchema.index(
  { owner: 1, tweet: 1 },
  {
    unique: true,
    partialFilterExpression: { tweet: { $exists: true } },
  }
);

commentSchema.index(
  { owner: 1, video: 1 },
  {
    unique: true,
    partialFilterExpression: { video: { $exists: true } },
  }
);



commentSchema.plugin(mongooseAggregatePaginate)
export const Comment=mongoose.model("Comment",commentSchema)