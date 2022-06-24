import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

import { resolve } from "path";
import { v4 as uuidV4 } from "uuid"

@injectable()
class SendConfirmationRegisterMailUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository) {

    }

    async execute(email: string) {

        const user = await this.usersRepository.findByEmail(email as string)

        const templatePath = resolve(__dirname, "..", "..", "..", "..", "..", "views", "accounts", "emails", "confirmateRegister.hbs")
        const token = uuidV4()

        const expires_date = this.dateProvider.addOrSubtractTime("add", "hours", 3)

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id as string,
            expires_date
        })

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