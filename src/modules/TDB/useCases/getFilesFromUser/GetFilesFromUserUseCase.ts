import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IFileResponseDTO } from "@modules/TDB/dtos/IFileResponseDTO";
import { File } from "@modules/TDB/entities/File";
import { FileMap } from "@modules/TDB/mapper/FileMap";
import { IFileRepository } from "@modules/TDB/repositories/IFileRepository";
import { inject, injectable } from "tsyringe";



@injectable()
class GetFilesFromUserUseCase {

    constructor(
        @inject("FileRepository")
        private fileRepository: IFileRepository
    ) {

    }

    async execute(user_id: string): Promise<IFileResponseDTO[]> {

        const files = await this.fileRepository.findByUserId(user_id)

        return files.map(file => {
            return FileMap.toDTO(file)
        });
    }

}

export { GetFilesFromUserUseCase }