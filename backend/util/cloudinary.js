const { v2 } = require("cloudinary");
const fs = require("fs");
const cloudinary = v2;

cloudinary.config({
  cloud_name: "dsrbflu0a",
  api_key: "425673899486623",
  api_secret: "Xp4012GXyXc3NEawuQnqOUx_SfM",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

module.exports = { uploadOnCloudinary };
