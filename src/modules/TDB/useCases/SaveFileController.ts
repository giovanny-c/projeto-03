import { AppError } from "@shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SaveFileUseCase } from "./SaveFileUseCase";

class SaveFileController {


    async handle(req: Request, res: Response): Promise<Response> {

        try {

            if (!req.file) {
                throw new AppError("No file provided", 400)
            }

            const { id: user_id } = req.user
            const { file_id } = req.body

            const { filename, mimetype } = req.file

            const saveFileUseCase = container.resolve(SaveFileUseCase)

            const response = await saveFileUseCase.execute({
                id: file_id, user_id, name: filename, mime_type: mimetype
            })

            return res.status(201).json(response)

        } catch (error) {
            throw error

        }//testar e criar o storage provider local e S3
    }


}

export { SaveFileController }