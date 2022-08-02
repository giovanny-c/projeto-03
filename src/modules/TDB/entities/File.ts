import { User } from "../../accounts/entities/User";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"

@Entity("storage")
class File {

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
    mime_type: string

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

export { File }