
import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import issueJWT from "../../../../utils/tokensUtils/issueJWT";
import { PRIV_KEY } from "../../../../utils/keyUtils/readKeys";
import { IEmailRequest } from "@modules/accounts/dtos/IEmaiRequestDTO";

@injectable()
class SendForgotPasswordMailUseCase {

    constructor(
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

    ) { }

    async execute({ email }: IEmailRequest): Promise<void> {

        const userExists = await this.usersRepository.findByEmail(email)

        if (!userExists) {

            throw new AppError("Invalid Email, try again", 418)
        }


        const templatePath = resolve(__dirname, "..", "..", "..", "..", "..", "views", "accounts", "emails", "forgotPassword.hbs")



        const token = issueJWT({ subject: userExists.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string })

        const variables = {
            name: userExists.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`

        }

        await this.mailProvider.sendMail({
            to: email,
            subject: "Recuperação de senha",
            variables,
            path: templatePath
        })




    }



}

export { SendForgotPasswordMailUseCase }