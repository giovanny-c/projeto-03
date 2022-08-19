

interface ISaveFileRequest {
    id: string
    user_id: string
    name: string
    mime_type: string
    path: string
    size: number
    is_public: boolean
}

export { ISaveFileRequest }