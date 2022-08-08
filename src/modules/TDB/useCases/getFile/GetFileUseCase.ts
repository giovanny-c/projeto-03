import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { File } from "@modules/TDB/entities/File";
import { FileMap } from "@modules/TDB/mapper/FileMap";
import { IFileRepository } from "@modules/TDB/repositories/IFileRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IFileResponseDTO } from "@modules/TDB/dtos/IFileResponseDTO"

@injectable()
class GetFileUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("FileRepository")
        private fileRepository: IFileRepository,
    ) {

    }

    async execute(file_id: string): Promise<IFileResponseDTO> {
        try {

            const file = await this.fileRepository.findById(file_id)

            if (!file) {
                throw new AppError("File not found!", 400)
            }
            const a = FileMap.toDTO(file)

            return a


        } catch (error) {
            throw error
        }

    }

}


export { GetFileUseCase }