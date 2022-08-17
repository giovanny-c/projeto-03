import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<Response> {
        try {

            const { email, password } = req.body

            const authenticateUser = container.resolve(AuthenticateUserUseCase)

            const response = await authenticateUser.execute({ email, password })


            if (process.env.SESSION_TYPE === "SESSION") {

                req.session.user = response.user

                return res.json({ "session": req.session })
            }

            return res.json(response)



        } catch (error) {
            throw error
        }
    }

}

export { AuthenticateUserController }