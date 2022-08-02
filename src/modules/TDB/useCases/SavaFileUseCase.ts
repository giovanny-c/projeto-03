import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import * as fs from "fs"
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

            if (id) {

                const userExists = await this.usersRepository.findById(user_id)

                if (!userExists) {
                    throw new AppError("User not found", 400)
                }

                const fileExists = await this.fileRepository.findById(id as string)

                if (!fileExists) {
                    throw new AppError("File not found")
                }

                if (userExists.id !== fileExists.user_id) {
                    throw new AppError("Error (You can't alter a file from other user)", 400)
                }

                //sempre antes do save
                fs.unlinkSync(`/usr/app/tmp/${fileExists.name}`) //remove a img antiga

                return await this.fileRepository.save({ id, user_id, name, mime_type, updated_at: this.dateProvider.dateNow() })
            }

            return await this.fileRepository.save({ user_id, name, mime_type, created_at: this.dateProvider.dateNow() })


        } catch (error) {
            throw error
        }

    }
}

export { SaveFileUseCase }