import {v2 as cloudinary} from 'cloudinary'
import { log } from 'console'
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const uploadOnCloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath) return null
        const res=await cloudinary.uploader.upload(localfilepath,{resource_type:'auto'})
        console.log("file public url",res.url)
        fs.unlinkSync(localfilepath)
        return res
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}
export {uploadOnCloudinary}