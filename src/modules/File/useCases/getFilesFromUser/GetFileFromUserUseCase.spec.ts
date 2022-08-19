import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"

import { FileRepositoryInMemory } from "@modules/File/repositories/In-memory/FileRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { GetFilesFromUserUseCase } from "./GetFilesFromUserUseCase"
import { IFileResponseDTO } from "@modules/File/dtos/IFileResponseDTO";

import { File } from "@modules/File/entities/File";




let getFilesFromUserUseCase: GetFilesFromUserUseCase
let fileRepository: FileRepositoryInMemory
let usersRepository: UsersRepositoryInMemory

describe("Return all files of the user", () => {


    beforeEach(() => {

        usersRepository = new UsersRepositoryInMemory()
        fileRepository = new FileRepositoryInMemory()
        getFilesFromUserUseCase = new GetFilesFromUserUseCase(fileRepository)

    })


    it("Should return all files from the user", async () => {

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,
        })

        const mime_type = "text/plain"

        await fileRepository.save({
            id: "d32d823-kd92k3d23-dd230dk203d-d0ajdjdwq0",
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })

        await fileRepository.save({
            id: "htt3223-kd92k3d23-dd230dk203d-d0ajdjdwq0",
            name: "ger22qw3d23dd23d2w3d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })

        const response = await getFilesFromUserUseCase.execute(user.id as string)


        expect(response[0]).toHaveProperty("file_url")
        expect(response[0]).toHaveProperty("user_id", user.id)
        expect(response[1]).toHaveProperty("file_url")
        expect(response[1]).toHaveProperty("user_id", user.id)
    })





})