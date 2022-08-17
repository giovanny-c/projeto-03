import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogOutUseCase } from "./LogOutUseCase";


class LogOutController {


    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.user // || req.body || req.query

        const logOut = container.resolve(LogOutUseCase)

        await logOut.execute({ user_id: id })

        req.session.destroy()

        return res.status(200).send()
        // return res.redirect("/accounts/login")
    }



}

export { LogOutController }