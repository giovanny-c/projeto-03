import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<Response> {
        try {

            const { email, password } = req.body

            const authenticateUser = container.resolve(AuthenticateUserUseCase)

            const response = await authenticateUser.execute({ email, password })

            // const sess = req.session
            // console.log(sess)
            if (process.env.SESSION_TYPE === "SESSION") {



                return res.json({ "session": req.session, "user": response })
            }

            return res.json(response)
            //render("page", {response})


        } catch (error) {
            throw error
        }
    }

}

export { AuthenticateUserController }