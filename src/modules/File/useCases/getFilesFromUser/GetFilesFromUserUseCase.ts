import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFileResponseDTO } from "@modules/File/dtos/IFileResponseDTO";
import { File } from "@modules/File/entities/File";
import { FileMap } from "@modules/File/mapper/FileMap";
import { IFileRepository } from "@modules/File/repositories/IFileRepository";
import { inject, injectable } from "tsyringe";



@injectable()
class GetFilesFromUserUseCase {

    constructor(
        @inject("FileRepository")
        private fileRepository: IFileRepository
    ) {

    }

    async execute(user_id: string): Promise<IFileResponseDTO[]> {

        try {


            const files = await this.fileRepository.findByUserId(user_id)

            return files.map(file => {
                return FileMap.toDTO(file)
            });

        } catch (error) {
            throw error
        }
    }

}

export { GetFilesFromUserUseCase }