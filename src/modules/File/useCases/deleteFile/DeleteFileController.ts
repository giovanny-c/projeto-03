
import { Request, Response } from "express"
import { container } from "tsyringe"
import { DeleteFileUseCase } from "./DeleteFileUseCase"

class DeleteFileController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id: user_id } = req.user
        const { id: file_id } = req.body || req.params


        const deleteFileUseCase = container.resolve(DeleteFileUseCase)

        await deleteFileUseCase.execute(file_id, user_id)


        return res.status(200).send()
    }

}

export { DeleteFileController }