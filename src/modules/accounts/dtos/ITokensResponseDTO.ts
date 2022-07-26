
interface ITokensResponse {
    user?: {
        email: string
    }
    token: string
    refresh_token?: string


}

export { ITokensResponse }