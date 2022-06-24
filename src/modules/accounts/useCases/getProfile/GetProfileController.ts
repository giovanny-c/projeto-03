import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetProfileUseCase } from "./GetProfileUseCase";


class GetProfileController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.user

        const getProfile = container.resolve(GetProfileUseCase)

        const profile = await getProfile.execute(id)

        return res.json(profile)
    }

}

export { GetProfileController }