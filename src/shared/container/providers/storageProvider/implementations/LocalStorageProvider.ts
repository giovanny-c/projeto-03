import upload from "@config/upload";
import * as fs from "fs"
import { resolve } from "path";
import { IFilePath, IStorageProvider } from "../IStorageProvider";


class LocalStorageProvider implements IStorageProvider {

    async save({ file, folder }: IFilePath): Promise<string> {

        let [fldr,] = folder.split("/", 2)// pega a primeira parte do split se houver

        let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo

        let dir = `${upload.tmpFolder}/${fldr}/${file_type}`
        //ex: tmp/image/jpg

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.renameSync( //poe o file outro lugar
            resolve(upload.tmpFolder, file),
            resolve(dir, file)
        )

        return file
    }

    async delete({ file, folder }: IFilePath): Promise<void> {

        let [fldr,] = folder.split("/", 2)// pega a primeira parte do split se houver, (vai vir do mime type)

        let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo ( o nome do arquivo salvo no bd)

        const file_name = resolve(`${upload.tmpFolder}/${fldr}/${file_type}`, file)

        try {
            fs.statSync(file_name)
        } catch {
            return
        }

        fs.unlinkSync(file_name)
    }

}

export { LocalStorageProvider }