import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { FileRepositoryInMemory } from "@modules/File/repositories/In-memory/FileRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { GetFileUseCase } from "./GetFileUseCase"




let getFileUseCase: GetFileUseCase
let fileRepository: FileRepositoryInMemory
let usersRepository: UsersRepositoryInMemory

describe("Return a file with the given id", () => {


    beforeEach(() => {

        usersRepository = new UsersRepositoryInMemory()
        fileRepository = new FileRepositoryInMemory()
        getFileUseCase = new GetFileUseCase(usersRepository, fileRepository)

    })


    it("Should return a file with the given id", async () => {

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,
        })

        const id = "d32d823-kd92k3d23-dd230dk203d-d0ajdjdwq0"
        const mime_type = "text/plain"

        await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })

        const response = await getFileUseCase.execute(id, user.id as string)

        expect(response).toHaveProperty("id", id)
        expect(response).toHaveProperty("file_url")
    })

    it("Should NOT return a file if it does not exists in db", async () => {

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,
        })

        const id = "d32d823-kd92k3d23-dd230dk203d-d0ajdjdwq0"
        const mime_type = "text/plain"

        await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })

        await expect(getFileUseCase.execute("fake_id-1212312311", user.id as string)).rejects.toEqual(new AppError("File not found!", 400))



    })

    it("Should NOT return a file if user requesting the file does not own it", async () => {

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,
        })

        const id = "d32d823-kd92k3d23-dd230dk203d-d0ajdjdwq0"
        const mime_type = "text/plain"

        await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
            permission: "private"
        })

        await expect(getFileUseCase.execute(id, "fake_user_id_d2d8j23jd28d")).rejects.toEqual(new AppError("You cant access this file, since you do not own it", 401))



    })



})