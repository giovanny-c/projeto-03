import upload from "@config/upload";
import * as fs from "fs"
import { resolve } from "path";
import { IStorageProvider } from "../IStorageProvider";


class LocalStorageProvider implements IStorageProvider {

    async save(file: string, folder: string): Promise<string> {

        let [fldr, subfolder] = folder.split("/", 2)
        let [, file_type] = file.split(".", 2)

        await fs.promises.rename( //poe o file outro lugar
            resolve(upload.tmpFolder, file),
            resolve(`${upload.tmpFolder}/${fldr}/${subfolder}`, file)
        )

        return file
    }
    async delete(file: string, folder: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}