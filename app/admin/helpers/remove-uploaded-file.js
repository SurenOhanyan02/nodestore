import fs from 'fs/promises'
import { BASE_FILE_PATH } from '../../constants/constants.js'
import path from 'path'

export const removeUploadedFile = async (webPath) => {
    try {
        if (!webPath) return
        const absolutePath = path.join(BASE_FILE_PATH, webPath)
        await fs.unlink(absolutePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File not found or already deleted', absolutePath);
        }
        else {
            console.log('Something went wrong when try delete file', absolutePath);
        }
    }
}