import { container } from "tsyringe"

import { Request, Response } from "express"

import { ConfirmateRegisterUseCase } from "./ConfirmateRegisterUseCase"

class ConfirmateRegisterController {

    async handle(req: Request, res: Response): Promise<Response> {

        const token = req.query.token

        const confirmateRegister = container.resolve(ConfirmateRegisterUseCase)

        await confirmateRegister.execute(token as string)

        return res.status(200).send()
        //redirect to login


    }

}

export { ConfirmateRegisterController } 