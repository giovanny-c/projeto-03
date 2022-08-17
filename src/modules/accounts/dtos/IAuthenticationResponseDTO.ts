
interface IAuthenticationResponse {
    user: {
        id: string
        email?: string
    }
    token?: string
    refresh_token?: string


}


export { IAuthenticationResponse }