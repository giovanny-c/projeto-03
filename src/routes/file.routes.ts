import { Router } from "express"

import multer from "multer"
import uploadConfig from "@config/upload"

import { ensureAuthenticated } from "@shared/middlewares/ensureAuthenticated"
import { SaveFileController } from "@modules/TDB/useCases/SaveDataController"

const fileRoutes = Router()

const upload = multer(uploadConfig)

const saveFileController = new SaveFileController()

fileRoutes.post("/save", ensureAuthenticated, upload.single("file"), saveFileController.handle)

export { fileRoutes }