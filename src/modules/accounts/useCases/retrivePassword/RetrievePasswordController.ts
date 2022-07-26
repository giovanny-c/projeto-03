import { Request, Response } from "express";
import { container } from "tsyringe";
import { RetrievePasswordUseCase } from "./RetrievePasswordUseCase";


class RetrievePasswordController {


    async handle(req: Request, res: Response): Promise<Response> {

        const { password, confirmPassword } = req.body

        const { token } = req.query

        const retrievePasswordUseCase = container.resolve(RetrievePasswordUseCase)

        await retrievePasswordUseCase.execute({ password, confirmPassword, token: token as string })

        return res.status(200).send()
    }
}

export { RetrievePasswordController }