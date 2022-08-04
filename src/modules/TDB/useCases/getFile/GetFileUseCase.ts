import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { File } from "@modules/TDB/entities/File";
import { FileMap } from "@modules/TDB/mapper/FileMap";
import { IFileRepository } from "@modules/TDB/repositories/IFileRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";


@injectable()
class GetFileUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("FileRepository")
        private fileRepository: IFileRepository,
    ) {

    }

    async execute(user_id: string, file_id): Promise<File> {
        try {

            const file = await this.fileRepository.findById(file_id)

            if (!file) {
                throw new AppError("File not found!", 400)
            }

            return FileMap.toDTO(file)

        } catch (error) {
            throw error
        }

    }

}


export { GetFileUseCase }