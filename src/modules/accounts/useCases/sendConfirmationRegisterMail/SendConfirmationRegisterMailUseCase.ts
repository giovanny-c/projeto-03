import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { resolve } from "path";
import issueJWT from "../../../../utils/tokensUtils/issueJWT";
import { PRIV_KEY } from "../../../../utils/keyUtils/readKeys";
import { AppError } from "../../../../shared/errors/AppError";


@injectable()
class SendConfirmationRegisterMailUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
    ) {

    }

    async execute(email: string) {

        try {


            const user = await this.usersRepository.findByEmail(email as string)

            if (!user) {
                throw new AppError("User not found", 500)
            }

            const templatePath = resolve(__dirname, "..", "..", "..", "..", "..", "views", "accounts", "emails", "confirmateRegister.hbs")

            const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_CONFIRAMTION_TOKEN as string })
            console.log(token)
            const variables = {
                name: user.name,
                link: `${process.env.CONFIRMATION_MAIL_URL}${token}`
            }

            await this.mailProvider.sendMail(
                user.email,
                "Confirmação de cadastro",
                variables,
                templatePath
            )

        } catch (error) {
            throw error
        }
    }

}
export { SendConfirmationRegisterMailUseCase }