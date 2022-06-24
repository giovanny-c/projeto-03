import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { email, password } = req.body

        const authenticateUser = container.resolve(AuthenticateUserUseCase)

        const response = await authenticateUser.execute(email, password)

        return res.json(response)
        //render("page", {response})

    }

}

export { AuthenticateUserController }