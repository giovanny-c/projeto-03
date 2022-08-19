import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { File } from "@modules/File/entities/File";
import { FileMap } from "@modules/File/mapper/FileMap";
import { IFileRepository } from "@modules/File/repositories/IFileRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IFileResponseDTO } from "@modules/File/dtos/IFileResponseDTO"

@injectable()
class GetFileUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("FileRepository")
        private fileRepository: IFileRepository,
    ) {

    }

    async execute(file_id: string, user_id: string): Promise<IFileResponseDTO> {
        try {



            const file = await this.fileRepository.findById(file_id)

            if (!file) {
                throw new AppError("File not found!", 400)
            }


            if (file.permission === "private" && file.user_id !== user_id) {
                throw new AppError("You cant access this file, since you do not own it", 401)
            }


            return FileMap.toDTO(file)


        } catch (error) {
            throw error
        }

    }

}


export { GetFileUseCase }