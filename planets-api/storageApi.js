const fs = require("fs");
const fsPromises = require('fs').promises;
const path = require("path");

const UPLOAD_ERROR = "UPLOAD_ERROR";
const tempStorageFolder = path.join(__dirname, "images");

if (!fs.existsSync(tempStorageFolder)) {
    fs.mkdirSync(tempStorageFolder, {recursive: true});
}

const uploadImageToLocalStorage = (file, newFileName) =>
    new Promise((resolve, reject) => {
        const filePath = path.join(tempStorageFolder, newFileName);

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.log("File upload failed ", newFileName, err);
                reject(UPLOAD_ERROR);
            } else {
                const publicAccessUrl = `http://localhost:3001/uploads/${ newFileName }`;
                resolve(publicAccessUrl);
            }
        });
    });

exports.storeImage = uploadImageToLocalStorage;

exports.deleteImage = async (fileName) => {
    if (!fileName) {
        return false;
    }

    try {
        const filePath = path.join(tempStorageFolder, fileName);

        if (fs.existsSync(filePath)) {
            console.log("Deleting image", fileName);
            fs.unlinkSync(filePath);
            return true;
        }

        return false;
    } catch (error) {
        console.log("Image deletion failed ", fileName, error);
        return false;
    }
};

exports.deleteAllImages = async () => {
    const imagesFolderPath = './images'

    try {
        const files = await fsPromises.readdir(imagesFolderPath);

        for (const file of files) {
            const filePath = path.join(imagesFolderPath, file);
            const stat = await fsPromises.lstat(filePath);

            if (stat.isFile()) {
                await fsPromises.unlink(filePath);
                console.log(`Deleted file: ${ filePath }`);
            }
        }

        console.log('All files deleted.');
    } catch (err) {
        console.error('Error while deleting files:', err);
    }
};
