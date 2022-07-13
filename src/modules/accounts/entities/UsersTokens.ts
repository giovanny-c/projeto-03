import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";



@Entity("users_tokens")
class UsersTokens {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    token: string

    @Column()
    user_id: string

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: string

    @Column()
    expires_date: Date

    @CreateDateColumn()
    created_at: Date

    @Column()
    is_valid: boolean

    @Column()
    was_used: boolean

    @Column()
    token_family: string






}

export { UsersTokens }