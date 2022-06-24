import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
class UpdatePasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private userTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(password: string, confirmPassword: string, token: string, user_id?: string): Promise<void> {

        if (password !== confirmPassword) {
            throw new AppError("Password and confirm password fields do not match")
        }

        let tokenExists

        if (!user_id) {
            tokenExists = await this.userTokensRepository.findByRefreshToken(token)

            if (!tokenExists) {
                throw new AppError("Invalid or missing Token")
            }

            if (this.dateProvider.compareIfBefore(tokenExists.expires_date, this.dateProvider.dateNow())) {

                throw new AppError("Token expired")
            }
            //pesquisar o user antes?
        }


        await this.userRepository.create({
            id: tokenExists.user_id as string || user_id,
            password
        })

    }

}

export { UpdatePasswordUseCase }