import { ISaveData } from "../dtos/ISaveDataDTO";
import { _Data } from "../entities/Data";



interface IDataRepository {


    save(data: ISaveData): Promise<_Data>
    findById(id: string): Promise<_Data>
    findByUserId(user_id: string): Promise<_Data[]>
    delete(id: string): Promise<void>
}

export { IDataRepository }