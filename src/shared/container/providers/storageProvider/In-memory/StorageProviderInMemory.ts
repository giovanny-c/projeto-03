import upload from "@config/upload";
import { IFilePath, IStorageProvider } from "../IStorageProvider";
import * as fs from "fs"

class StorageProviderInMemory implements IStorageProvider {

    async save({ file, folder }: IFilePath): Promise<string> {

        let file_path = `${upload.tmpFolder}/${folder}/${file}`

        fs.writeFileSync(file_path, "teste")

        return file_path

    }
    async delete({ file, folder }: IFilePath): Promise<void> {
        let file_path = `${upload.tmpFolder}/${folder}/${file}`

        fs.unlinkSync(file_path)

    }

}

export { StorageProviderInMemory }