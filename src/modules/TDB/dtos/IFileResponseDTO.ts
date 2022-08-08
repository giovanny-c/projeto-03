

interface IFileResponseDTO {

    id: string
    user_id: string
    name: string
    mime_type: string
    extension: string
    size: number
    storage_type: string
    permissiom?: string
    created_at?: Date
    updated_at?: Date
    file_url(): string
}

export { IFileResponseDTO }