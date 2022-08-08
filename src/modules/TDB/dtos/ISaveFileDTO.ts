

interface ISaveFile {

    id?: string

    user_id: string

    name: string

    mime_type: string

    path?: string

    extension?: string

    size?: number

    storage_type?: string

    permission?: string

    created_at?: Date

    updated_at?: Date
}

export { ISaveFile }