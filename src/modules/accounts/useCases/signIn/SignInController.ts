import { Request, Response } from "express";
import { resolve } from "path";


class SignInController {

    handle(req: Request, res: Response): any {


        return res.render("views/accounts/signIn")
    }

}

export { SignInController }