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
  { likedBy: 1, tweet: 1 },
  {
    unique: true,
    partialFilterExpression: { tweet: { $exists: true } },
  }
);

likeSchema.index(
  { likedBy: 1, video: 1 },
  {
    unique: true,
    partialFilterExpression: { video: { $exists: true } },
  }
);

likeSchema.index(
  { likedBy: 1, comment: 1 },
  {
    unique: true,
    partialFilterExpression: { comment: { $exists: true } },
  }
);


likeSchema.pre("save", function () {
  if (this.video === null) this.video = undefined;
  if (this.comment === null) this.comment = undefined;
  if (this.tweet === null) this.tweet = undefined;
//   next();
});                                 

export const Like=mongoose.model("Like",likeSchema)