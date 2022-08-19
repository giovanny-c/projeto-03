import { ISaveFile } from "../dtos/ISaveFileDTO";
import { File } from "../entities/File";



interface IFileRepository {


    save(data: ISaveFile): Promise<File>
    findById(id: string): Promise<File>
    findByUserId(user_id: string): Promise<File[]>
    delete(id: string): Promise<void>
}

export { IFileRepository }