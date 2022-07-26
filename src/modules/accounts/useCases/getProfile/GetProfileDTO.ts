

interface IGetProfileRequest {
    id: string
}

interface IGetProfileResponse {

    email: string
    name: string
}

export { IGetProfileRequest, IGetProfileResponse }