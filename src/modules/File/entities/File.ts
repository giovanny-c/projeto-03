import { User } from "../../accounts/entities/User";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid"
import { Expose } from "class-transformer";

@Entity("storage")
class File {

    @PrimaryColumn()
    id: string

    @Column()
    user_id: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user?: User

    @Column()
    name: string

    @Column() // futuramente Armazenar no aws bucket 
    mime_type: string

    @Column()
    extension: string

    @Column()
    size: number

    @Column()
    storage_type: string

    @Column()
    permission: string

    @Column()
    created_at?: Date

    @Column()
    updated_at?: Date

    @Expose({ name: "file_url" })
    file_url(): string {
        switch (this.storage_type) {
            case "local":
                return `${process.env.APP_API_URL}/${this.mime_type}/${this.name}`

            case "s3":
                return `${process.env.AWS_BUCKET_URL}/${this.mime_type}/${this.name}`

            default:
                return "file url not found!"
        }
    }

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { File }