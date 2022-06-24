
import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { v4 as uuidV4 } from "uuid"
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
class SendForgotPasswordMailUseCase {

    constructor(
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository

    ) { }

    async execute(email: string): Promise<void> {

        const userExists = await this.usersRepository.findByEmail(email)

        if (!userExists) {

            throw new AppError("Invalid Email, try again", 418)
        }


        const templatePath = resolve(__dirname, "..", "..", "..", "..", "..", "views", "accounts", "emails", "forgotPassword.hbs")

        const token = uuidV4()

        const expires_date = this.dateProvider.addOrSubtractTime("add", "hours", 3)

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: userExists.id as string,
            expires_date: expires_date
        })

        const variables = {
            name: userExists.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`

        }

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        )




    }



}

export { SendForgotPasswordMailUseCase }