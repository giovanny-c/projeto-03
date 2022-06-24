
interface ICreateUserDTO {

    id?: string

    name?: string

    email?: string

    password?: string

    is_confirmed?: boolean

    is_logged?: boolean
}

export { ICreateUserDTO }