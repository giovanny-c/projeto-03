import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ISaveFile } from "../dtos/ISaveFileDTO";
import { File } from "../entities/File";
import { IFileRepository } from "../repositories/IFileRepository";

@injectable()
class SaveFileUseCase {

    constructor(
        @inject("FileRepository")
        private fileRepository: IFileRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {

    }

    async execute({ id, user_id, name, mime_type }: ISaveFile): Promise<File> {
        try {


            const userExists = await this.usersRepository.findById(user_id)

            if (!userExists) {
                throw new AppError("User not found", 400)
            }


            const FileExists = await this.fileRepository.findById(id as string)

            if (!id || !FileExists) {

                return await this.fileRepository.save({ user_id, name, mime_type, created_at: this.dateProvider.dateNow() })
            }

            return await this.fileRepository.save({ id, user_id, name, mime_type, updated_at: this.dateProvider.dateNow() })

        } catch (error) {
            throw error
        }

    }
}

export { SaveFileUseCase }