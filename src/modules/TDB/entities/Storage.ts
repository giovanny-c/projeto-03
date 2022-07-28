import { User } from "../../../modules/accounts/entities/User";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"

@Entity("storage")
class Storage {

    @PrimaryColumn()
    id: string

    @Column()
    user_id: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    name: string

    @Column() // futuramente Armazenar no aws bucket 
    _data: string

    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { Storage }