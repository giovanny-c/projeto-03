
interface ITokensResponse {
    user: {
        id: string
        email: string
    }
    token?: string
    refresh_token?: string


}
interface ICookieResponse {
    Session: {
        cookie: {
            path: string
            _expires: Date
            originalMaxAge: number
            httpOnly: boolean
            secure: boolean
        }
    }
}

export { ITokensResponse, ICookieResponse }