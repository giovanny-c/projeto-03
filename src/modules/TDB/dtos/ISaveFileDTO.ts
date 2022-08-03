

interface ISaveFile {

    id?: string

    user_id: string

    name: string

    mime_type: string

    created_at?: Date

    updated_at?: Date

    path?: string

    extension?: string
}

export { ISaveFile }