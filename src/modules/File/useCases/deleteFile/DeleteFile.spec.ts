import upload from "@config/upload"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"

import { FileRepositoryInMemory } from "@modules/File/repositories/In-memory/FileRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider"
import { StorageProviderInMemory } from "@shared/container/providers/storageProvider/In-memory/StorageProviderInMemory"

import * as fs from "fs"
import { AppError } from "@shared/errors/AppError"
import { DeleteFileUseCase } from "./DeleteFileUseCase"






let deleteFileUseCase: DeleteFileUseCase

let usersRepository: UsersRepositoryInMemory
let fileRepository: FileRepositoryInMemory
let storageProvider: StorageProviderInMemory

describe("Delete a File", () => {

    beforeEach(() => {

        fileRepository = new FileRepositoryInMemory()
        usersRepository = new UsersRepositoryInMemory()
        storageProvider = new StorageProviderInMemory()
        deleteFileUseCase = new DeleteFileUseCase(usersRepository, fileRepository, storageProvider)

    })

    it("Should delete a file", async () => {

        const deleteFile = jest.spyOn(storageProvider, "delete")

        let id = "cwe9kd2dk3d-f43f34f3d3g-d2g43323d2q-d23d2d3"
        let mime_type = "text/plain"

        const user = await usersRepository.save({
            email: "test@email.com",
            name: "test",
            password_hash: "332dadsadasfdfdd",
            salt: "a32ddsdasd",
            is_confirmed: true,
            is_logged: true,

        })



        const file = await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })

        let file_path = `${upload.tmpFolder}/${mime_type}/${file.name}`
        fs.writeFileSync(file_path, "teste")

        await deleteFileUseCase.execute(file.id, user.id as string)

        expect(deleteFile).toHaveBeenCalled()
        expect(deleteFile).toReturn()
        expect(await fileRepository.findById(file.id)).toEqual(undefined)

    })



    it("Should NOT delete a file if the user does not own the file or do not exists", async () => {



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
        const name = "3223d23dd23d23d2-TEST_NEW.txt"

        const file = await fileRepository.save({
            id,
            name: "3223d23dd23d23d2-TEST.txt",
            mime_type,
            user_id: user1.id as string,
            size: 5,
            extension: "txt",
            storage_type: "local",
        })



        let file_path = `${upload.tmpFolder}/${mime_type}/${file.name}`
        fs.writeFileSync(file_path, "teste")

        await expect(
            deleteFileUseCase.execute(id, user2.id as string)
        ).rejects.toEqual(new AppError("File not found OR (You cant delete this file. Since you do not own it.)", 404))

        fs.unlinkSync(file_path)

    })





})