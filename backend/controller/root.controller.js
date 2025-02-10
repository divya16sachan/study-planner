import { cloudinary, removeCloudinaryImage } from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
    const { imageBase64 } = req.body;
    const { user } = req;
    if (!imageBase64) {
        return res.status(400).json({ message: "Image is required" });
    }


    try {
        const result = await cloudinary.uploader.upload(imageBase64);
        const imageUrl = result.secure_url;
        user.imageUrls = [imageUrl, ...user.imageUrls];
        await user.save();
        return res.status(200).json({
            imageUrls: user.imageUrls,
            message: "Image uploaded successfully",
        });
    } catch (error) {
        console.log("Error in uploadImage controller\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const removeImage = async (req, res) => {
    const { imageUrl } = req.body;
    const { user } = req;
    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
    }

    try {
        const { success, status, message } = await removeCloudinaryImage(imageUrl);
        if (success) {
            user.imageUrls = user.imageUrls.filter(url => url !== imageUrl);
            await user.save();
        }
        res.status(status).json({
            success,
            message,
            imageUrls: user.imageUrls,
        });
    } catch (error) {
        console.error('Error in removeImage controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getImages = async (req, res) => {
    try {
        const { user } = req;
        const { imageUrls } = user;
        res.status(200).json({ imageUrls });
    } catch (error) {
        console.log('error in get image urls\n', error);
        res.status(500).json({ message: "Internal server error" });
    }
}