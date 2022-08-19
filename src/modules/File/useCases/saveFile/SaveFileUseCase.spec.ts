import upload from "@config/upload"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { ISaveFile } from "@modules/File/dtos/ISaveFileDTO"
import { File } from "@modules/File/entities/File"
import { FileRepositoryInMemory } from "@modules/File/repositories/In-memory/FileRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider"
import { LocalStorageProvider } from "@shared/container/providers/storageProvider/implementations/LocalStorageProvider"
import { StorageProviderInMemory } from "@shared/container/providers/storageProvider/In-memory/StorageProviderInMemory"
import { ISaveFileRequest } from "./SaveFileDTO"
import { SaveFileUseCase } from "./SaveFileUseCase"
import * as fs from "fs"
import { AppError } from "@shared/errors/AppError"
import { rejects } from "assert"





let saveFileUseCase: SaveFileUseCase
let usersRepository: UsersRepositoryInMemory
let fileRepository: FileRepositoryInMemory
let dateProvider: DayjsDateProvider
let storageProvider: StorageProviderInMemory

describe("save a File", () => {

    beforeEach(() => {

        dateProvider = new DayjsDateProvider()
        fileRepository = new FileRepositoryInMemory()
        usersRepository = new UsersRepositoryInMemory()
        storageProvider = new StorageProviderInMemory()
        saveFileUseCase = new SaveFileUseCase(fileRepository, dateProvider, usersRepository, storageProvider)

    })

    it("Should save a file that do NOT exists in the db", async () => {

        const saveFile = jest.spyOn(storageProvider, "save")


        let name = "3223d23dd23d23d2-TEST.txt"
        let mime_type = "text/plain"

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,

        })

        const file: ISaveFileRequest = {
            id: "",
            name,
            mime_type,
            path: `${upload.tmpFolder}/${name}`,
            user_id: user.id as string,
            size: 3,
            is_public: true,
        }

        const response = await saveFileUseCase.execute(file)

        expect(saveFile).toHaveBeenCalled()
        expect(saveFile).toReturn()
        expect(response).toHaveProperty("id")
        expect(response).toHaveProperty("created_at")
        expect(response).toHaveProperty("name", name)

    })

    it("Should save a file that do exists in the db", async () => {

        const saveFile = jest.spyOn(storageProvider, "save")

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

        const name = "3223d23dd23d23d2-TEST_NEW.txt"

        const response = await saveFileUseCase.execute({
            id,
            name,
            mime_type,
            path: `${upload.tmpFolder}/${name}`,
            user_id: user.id as string,
            size: 3,
            is_public: true,
        })

        expect(saveFile).toHaveBeenCalled()
        expect(saveFile).toReturn()
        expect(response).toHaveProperty("id", id)
        expect(response).toHaveProperty("updated_at")
        expect(response).toHaveProperty("name", name)

        await storageProvider.delete({ file: name, folder: mime_type })

    })

    it("Should NOT save a file if the given id do not exists in de db", async () => {



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


        const name = "3223d23dd23d23d2-TEST_NEW.txt"
        fs.writeFileSync(`${upload.tmpFolder}/${name}`, "")

        await expect(
            saveFileUseCase.execute({
                id: "fake_id_adasdasdaksdaksd",
                name,
                mime_type,
                path: `${upload.tmpFolder}/${name}`,
                user_id: user.id as string,
                size: 3,
                is_public: true,
            })
        ).rejects.toEqual(new AppError("File not found", 400))

    })

    it("Should NOT save a file if the user does not exists in de db", async () => {



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


        const name = "3223d23dd23d23d2-TEST_NEW.txt"
        fs.writeFileSync(`${upload.tmpFolder}/${name}`, "")

        await expect(
            saveFileUseCase.execute({
                id,
                name,
                mime_type,
                path: `${upload.tmpFolder}/${name}`,
                user_id: "fake_user_id_dasdewewwsedd",
                size: 3,
                is_public: true,
            })
        ).rejects.toEqual(new AppError("User not found", 400))


    })

    it("Should NOT save a file if the user does not own the file", async () => {



        const user1 = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,

        })

        const user2 = await usersRepository.save({
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
            user_id: user1.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })


        const name = "3223d23dd23d23d2-TEST_NEW.txt"
        fs.writeFileSync(`${upload.tmpFolder}/${name}`, "")

        await expect(
            saveFileUseCase.execute({
                id,
                name,
                mime_type,
                path: `${upload.tmpFolder}/${name}`,
                user_id: user2.id as string,
                size: 3,
                is_public: true,
            })
        ).rejects.toEqual(new AppError("Error (You can't alter a file from other user)", 403))

    })


    it("Should NOT save a file if the storage type differs from the current being used by the app", async () => {



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
        const storage_type = "OTHER"

        await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type,
        })


        const name = "3223d23dd23d23d2-TEST_NEW.txt"
        fs.writeFileSync(`${upload.tmpFolder}/${name}`, "")

        await expect(
            saveFileUseCase.execute({
                id,
                name,
                mime_type,
                path: `${upload.tmpFolder}/${name}`,
                user_id: user.id as string,
                size: 3,
                is_public: true,
            })

        ).rejects.toEqual(new AppError(`You can't save this file because the file with this id is stored in the ${storage_type} storage. (Change the storage type to update the file)`, 500))

    })




})