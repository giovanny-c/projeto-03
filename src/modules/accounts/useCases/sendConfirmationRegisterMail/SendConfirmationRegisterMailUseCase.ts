import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

import { resolve } from "path";
import { v4 as uuidV4 } from "uuid"
import issueJWT from "../../../../../utils/tokens/issueJWT";

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

        const user = await this.usersRepository.findByEmail(email as string)

        const templatePath = resolve(__dirname, "..", "..", "..", "..", "..", "views", "accounts", "emails", "confirmateRegister.hbs")

        const PRIV_KEY = fs.readFileSync("../../../../../keys/id_rsa_priv.pem", 'utf-8')

        const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_CONFIRAMTION_TOKEN as string })

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
    }

}
export { SendConfirmationRegisterMailUseCase }