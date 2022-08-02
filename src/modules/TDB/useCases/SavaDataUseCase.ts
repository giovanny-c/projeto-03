import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ISaveData } from "../dtos/ISaveDataDTO";
import { _Data } from "../entities/Data";
import { IDataRepository } from "../repositories/IDataRepository";

@injectable()
class SaveDataUseCase {

    constructor(
        @inject("DataRepository")
        private dataRepository: IDataRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UserRepository")
        private usersRepository: IUsersRepository
    ) {

    }

    async execute({ id, user_id, name, _data }: ISaveData): Promise<_Data> {
        try {


            const userExists = await this.usersRepository.findById(user_id)

            if (!userExists) {
                throw new AppError("User not found", 400)
            }

            const dataExists = await this.dataRepository.findById(id as string)

            if (!dataExists) {

                return await this.dataRepository.save({ user_id, name, _data, created_at: this.dateProvider.dateNow() })

            }


            return await this.dataRepository.save({ id, user_id, name, _data, updated_at: this.dateProvider.dateNow() })

        } catch (error) {
            throw error
        }

    }
}

export { SaveDataUseCase }