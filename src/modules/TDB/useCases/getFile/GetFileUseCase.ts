import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { File } from "@modules/TDB/entities/File";
import { IFileRepository } from "@modules/TDB/repositories/IFileRepository";
import { IStorageProvider } from "@shared/container/providers/storageProvider/IStorageProvider";
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

    // async execute(user_id: string, file_id): Promise<File> {



    //     return
    // }

}