import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetFilesFromUserUseCase } from "./GetFilesFromUserUseCase";


class GetFileFromUserController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id: user_id } = req.user

        const getFilesFromUserUseCase = container.resolve(GetFilesFromUserUseCase)

        const response = await getFilesFromUserUseCase.execute(user_id)

        return res.status(200).json(response)
    }

}

export { GetFileFromUserController }