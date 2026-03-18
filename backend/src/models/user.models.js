import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// const userSchema=new mongoose.Schema(
//     {
//         username:{
//             type:String,
//             required:true,
//             unique:true,
//             lowercase:true,
//             trim:true
//         },
//         email:{
//             type:String,
//             required:true,
//             unique:true,
//             lowercase:true,
//             trim:true
//         },
//         fullName:{
//             type:String,
//             required:true
//         },
//         password:{
//             type:String,
//             required:true,
//             minlength:6
//         },
//         avatar:{
//             type:String,
//             required :true
//         },
//         coverImage:{
//             type:String,
//             required:true
//         },
//         refreshToken:{
//             type:String
//         },
//         watchHistory:[{
//             type:Schema.Types.ObjectId,
//             ref:"Video"
//         }]
//     },
//     {timestamps:true}
// )

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    avatar: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    refreshToken: {
      type: String,
      select: false
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);



userSchema.plugin(mongooseAggregatePaginate)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 10);
    // next();   //
});

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username

        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
}
export const User=mongoose.model("User",userSchema)