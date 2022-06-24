import { inject, injectable } from "tsyringe";


import { IUsersTokensRepository } from "../../../../modules/accounts/repositories/IUsersTokensRepository"
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepository } from "../../repositories/implementations/UsersRepository";




@injectable()
class ConfirmateRegisterUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: UsersRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {

    }

    async execute(confirmationToken: string): Promise<void> {

        const token = await this.usersTokensRepository.findByRefreshToken(confirmationToken)

        if (!token) {
            throw new AppError("Invalid Token")
        }

        //se a data de expiração 
        if (this.dateProvider.compareIfBefore(token.expires_date, this.dateProvider.dateNow())) {
            throw new AppError("Token expired")
        }

        const user = await this.usersRepository.findById(token.user_id)

        user.is_confirmed = true

        await this.usersRepository.create(user)

        await this.usersTokensRepository.deleteById(token.id)

    }

}

export { ConfirmateRegisterUseCase }