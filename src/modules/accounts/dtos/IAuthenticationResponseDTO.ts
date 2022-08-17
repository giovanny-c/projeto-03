
interface IAuthenticationResponse {
    user: {
        id: string
        email?: string
        admin?: boolean
    }
    token?: string
    refresh_token?: string


}


export { IAuthenticationResponse }