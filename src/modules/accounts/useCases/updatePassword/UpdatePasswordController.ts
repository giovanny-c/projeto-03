import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdatePasswordUseCase } from "./UpdatePasswordUseCase";


class UpdatePasswordController {


    async handle(req: Request, res: Response): Promise<Response> {

        const { password, confirmPassword } = req.body
        const { token } = req.query

        const updatePasswordUseCase = container.resolve(UpdatePasswordUseCase)

        await updatePasswordUseCase.execute(password, confirmPassword, token as string)

        return res.status(200).send()
    }
}

export { UpdatePasswordController }