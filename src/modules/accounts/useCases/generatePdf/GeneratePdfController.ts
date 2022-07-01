import { Request, Response } from "express";
import { container } from "tsyringe";
import { GeneratePdfUseCase } from "./GeneratePdfUseCase";


class GeneratePdfController {

    async handle(req: Request, res: Response): Promise<Response> {

        const user_id = req.user.id

        const GeneratePdf = container.resolve(GeneratePdfUseCase)

        await GeneratePdf.execute(req.body, user_id)

        return res.status(201).send()
    }
}

export { GeneratePdfController }