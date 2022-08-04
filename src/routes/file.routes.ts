import { Router } from "express"

import multer from "multer"
import uploadConfig from "@config/upload"

import { ensureAuthenticated } from "@shared/middlewares/ensureAuthenticated"
import { SaveFileController } from "@modules/TDB/useCases/saveFile/SaveFileController"
import { GetFileController } from "@modules/TDB/useCases/getFile/GetFileController"

const fileRoutes = Router()

const upload = multer(uploadConfig)

const saveFileController = new SaveFileController()
const getFileController = new GetFileController()

fileRoutes.post("/save", ensureAuthenticated, upload.single("file"), saveFileController.handle)
fileRoutes.get("/get", getFileController.handle)

export { fileRoutes }