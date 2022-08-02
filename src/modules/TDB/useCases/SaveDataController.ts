import { Request, Response } from "express";
import { container } from "tsyringe";
import { SaveDataUseCase } from "./SavaDataUseCase";

class SaveDataController {


    async handle(req: Request, res: Response): Promise<Response> {

        try {

            const { id: user_id } = req.user
            const { id, _data, name } = req.body


            const saveDataUseCase = container.resolve(SaveDataUseCase)

            const response = await saveDataUseCase.execute({
                id, user_id, name, _data
            })

            return res.status(201).json(response)

        } catch (error) {
            throw error
        }//testar e criar o storage provider local e S3
    }


}

export { SaveDataController }