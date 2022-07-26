import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetProfileUseCase } from "./GetProfileUseCase";


class GetProfileController {

    async handle(req: Request, res: Response): Promise<Response> {
        try {

            const { id } = req.user || req.body

            const getProfile = container.resolve(GetProfileUseCase)

            const profile = await getProfile.execute({ id })

            return res.json(profile)
        } catch (error) {
            throw error
        }
    }

}

export { GetProfileController }