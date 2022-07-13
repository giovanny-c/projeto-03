

interface ICreateUserTokenDTO {


    user_id: string
    expires_date?: Date
    token: string
    is_valid?: boolean
    was_used?: boolean
    token_family?: string


}

export { ICreateUserTokenDTO }