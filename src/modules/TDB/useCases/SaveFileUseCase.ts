import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/dateProvider/IDateProvider";
import { IStorageProvider } from "@shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ISaveFile } from "../dtos/ISaveFileDTO";
import { File } from "../entities/File";
import { IFileRepository } from "../repositories/IFileRepository";

import * as fs from "fs"

@injectable()
class SaveFileUseCase {

    constructor(
        @inject("FileRepository")
        private fileRepository: IFileRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {

    }

    async execute({ id, user_id, name, mime_type, path }: ISaveFile): Promise<File> {
        try {

            const userExists = await this.usersRepository.findById(user_id)

            if (!userExists) {
                throw new AppError("User not found", 400)
            }

            //update do arquivo
            if (id) {// busca o arquivo se existir o id

                const fileExists = await this.fileRepository.findById(id as string)

                if (!fileExists) {

                    fs.unlinkSync(path as string)

                    throw new AppError("File not found")
                }

                if (userExists.id !== fileExists.user_id /*&& userExists.admin === false*/) {

                    fs.unlinkSync(path as string)

                    throw new AppError("Error (You can't alter a file from other user)", 400)
                }

                //remove o file antigo do storage
                await this.storageProvider.delete({ file: fileExists.name, folder: fileExists.mime_type })

                //salva o file novo no storage
                await this.storageProvider.save({ file: name, folder: mime_type })

                //salva no bd, no lugar do antigo
                return await this.fileRepository.save({ id, user_id, name, mime_type, updated_at: this.dateProvider.dateNow() })
            }

            //salva no storage
            await this.storageProvider.save({ file: name, folder: mime_type })

            //salva no bd
            return await this.fileRepository.save({ user_id, name, mime_type, created_at: this.dateProvider.dateNow() })


        } catch (error) {
            throw error
        }

    }
}

export { SaveFileUseCase }