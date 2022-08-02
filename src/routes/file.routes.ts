import { Router } from "express"
import multer from "multer"

import { ensureAuthenticated } from "@shared/middlewares/ensureAuthenticated"
import { SaveDataController } from "@modules/TDB/useCases/SaveDataController"

const fileRoutes = Router()
const upload = multer()

const saveDataController = new SaveDataController()

fileRoutes.post("/save", ensureAuthenticated, upload.single, saveDataController.handle)

export { fileRoutes }