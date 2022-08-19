import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFileRepository } from "@modules/File/repositories/IFileRepository";
import { IStorageProvider } from "@shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";



@injectable()
class DeleteFileUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("FileRepository")
        private fileRepository: IFileRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {

    }

    async execute(file_id: string, user_id: string): Promise<void> {

        try {
            console.log(user_id)
            const user = await this.usersRepository.findById(user_id)

            if (!user) {
                throw new AppError("User not found", 400)
            }

            const file = await this.fileRepository.findById(file_id)

            if (file.user_id !== user.id) {
                throw new AppError("File not found OR (You cant delete this file. Since you do not own it.)", 404)// no lugar do forbidden, para user que nao é dono nao saber que file existe
            }

            await this.storageProvider.delete({ file: file.name, folder: file.mime_type })

            await this.fileRepository.delete(file.id)



        } catch (error) {
            throw error
        }

    }

}

export { DeleteFileUseCase }