import { ISaveData } from "@modules/TDB/dtos/ISaveDataDTO";
import { _Data } from "@modules/TDB/entities/Data";
import { dataSource } from "database";
import { Repository } from "typeorm";
import { IDataRepository } from "../IDataRepository";


class DataRepository implements IDataRepository {

    private repository: Repository<_Data>

    constructor() {
        this.repository = dataSource.getRepository(_Data)
    }

    async save({ id, user_id, name, _data, created_at, updated_at }: ISaveData): Promise<_Data> {

        const data = this.repository.create({
            id,
            user_id,
            name,
            _data,
            created_at,
            updated_at
        })

        await this.repository.save(data)

        return data

    }
    async findById(id: string): Promise<_Data> {

        const data = await this.repository.findOneBy({ id }) as _Data

        return data
    }
    async findByUserId(user_id: string): Promise<_Data[]> {
        const data = await this.repository.findBy({ user_id })

        return data


    }
    async delete(id: string): Promise<void> {

        await this.repository.delete(id)
    }

}