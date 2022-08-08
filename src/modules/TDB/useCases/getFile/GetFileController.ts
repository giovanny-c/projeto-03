import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetFileUseCase } from "./GetFileUseCase";


class GetFileController {

    async handle(req: Request, res: Response): Promise<Response> {
        try {

            const { id: file_id } = req.params
            const { id: user_id } = req.user

            const getFileUseCase = container.resolve(GetFileUseCase)

            const response = await getFileUseCase.execute(file_id, user_id)// temp

            return res.status(200).json(response)

        } catch (error) {
            throw error
        }
    }


}

export {
    GetFileController
}