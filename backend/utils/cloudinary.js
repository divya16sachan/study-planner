import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const removeCloudinaryImage = async (imageUrl, path = '') => {

    if (!imageUrl) {
        return {success: false, status: 400, message: "Image URL is required"};
    }
    const match = imageUrl.match(/(?<=\/)[^\/]+(?=\.[a-z]+$)/);
    const imageName = match? match[0] : null;

    if(!imageName){
        return {success: false, status: 500, message: 'Could not extract image name from the url'};
    }
    const result = await cloudinary.uploader.destroy(path + imageName);
    
    if(result.result !== "ok"){
        return {success: false, status: 500, message: `failed to remove image`};
    }
    
    return {success: true, status: 200, message: "removed sucessfully"};
}

export { cloudinary, removeCloudinaryImage };