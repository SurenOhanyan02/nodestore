import multer from 'multer';
import path from 'path'
import fs from 'fs/promises'
import { BASE_FILE_PATH, MULTER_UPLOAD_MODE } from '../constants/constants.js';
import { v4 as uuid } from 'uuid'

export const uploadFileMiddleware = (fieldName, {
    mode = MULTER_UPLOAD_MODE.single,
    maxSizeMB = 5,
    allowedTypes = [],
    maxCount = 5,
    prefix = '',
    subFolder = ''
}) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0')

    const dynamicFolder = `${subFolder}/${year}/${month}`
    const fullPath = path.join(BASE_FILE_PATH, dynamicFolder)



    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                await fs.mkdir(fullPath, { recursive: true })
                cb(null, fullPath)
            } catch (error) {
                return cb(new Error(`Can't create folder`))
            }
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const unique = uuid()
            cb(null, `${prefix}-${unique}${ext}`)
        }
    })

    const fileTypeFilter = (req, file, cb) => {
        if (allowedTypes.length > 0) {
            const ext = path.extname(file.originalname).toLowerCase().substring(1)
            if (!allowedTypes.includes(ext)) {
                return cb(new Error('Unsupported file format'))
            }
        }
        cb(null, true)
    }

    const upload = multer({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileTypeFilter
    })

    const handler = mode === MULTER_UPLOAD_MODE.multiple ? upload.array(fieldName, maxCount) : upload.single(fieldName)

    return (req, res, next) => {
        handler(req, null, (err) => {
            if (err) {
                req.session.error = err.message
                return res.redirect('back')
            }
            if (req.file) {
                req.filePath = `${dynamicFolder}/${req.file.filename}`
            }
            if (req.files) {
                req.filePaths = req.files.map((file) => `/${BASE_FILE_PATH}/${dynamicFolder}/${file.filename}`)
            }
            next()
        })
    }
}