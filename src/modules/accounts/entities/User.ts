import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer"

@Entity("users")
class User {

    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column()
    name: string

    @Column()
    email: string

    //@Exclude()//nao vai trazer a senha 
    @Column()
    password_hash: string

    @Column()
    salt: string

    @Column()
    is_confirmed: boolean

    @Column()
    is_logged: boolean


}

export { User }