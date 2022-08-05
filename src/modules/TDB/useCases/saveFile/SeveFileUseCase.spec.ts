import upload from "@config/upload"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { ISaveFile } from "@modules/TDB/dtos/ISaveFileDTO"
import { FileRepositoryInMemory } from "@modules/TDB/repositories/In-memory/FileRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider"
import { LocalStorageProvider } from "@shared/container/providers/storageProvider/implementations/LocalStorageProvider"
import { ISaveFileRequest } from "./SaveFileDTO"
import { SaveFileUseCase } from "./SaveFileUseCase"



let saveFileUseCase: SaveFileUseCase
let usersRepository: UsersRepositoryInMemory
let fileRepository: FileRepositoryInMemory
let dateProvider: DayjsDateProvider
let storageProvider: LocalStorageProvider

describe("save a File", () => {

    beforeEach(() => {

        dateProvider = new DayjsDateProvider()
        fileRepository = new FileRepositoryInMemory()
        usersRepository = new UsersRepositoryInMemory()
        storageProvider = new LocalStorageProvider()
        saveFileUseCase = new SaveFileUseCase(fileRepository, dateProvider, usersRepository, storageProvider)

    })

    it("Should save a file that do not exist in the db", async () => {

        let name = "3223d23dd23d23d2-01.png"
        let mime_type = "image/png"

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
            path: `${upload.tmpFolder}/${mime_type}/${name}`,
            user_id: user.id as string,
            size: 3,
        }

        const response = await saveFileUseCase.execute(file)

        expect(response).toEqual(File)


    })


})