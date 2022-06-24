import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";


class RefreshTokenController {

    async handle(req: Request, res: Response): Promise<Response> {

        const token = req.body.token || req.query.token || req.headers['x-access-token']

        const refreshToken = container.resolve(RefreshTokenUseCase)

        const result = await refreshToken.execute(token)

        return res.json(result)
    }

}

export { RefreshTokenController }