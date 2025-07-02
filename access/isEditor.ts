import type { Access } from 'payload'
import { User } from '@/payload-types'

export const isEditorAccess: Access = ({ req }): boolean => {
    return isEditor(req.user)
}

export const isEditor = (user: User | null): boolean => {
    return Boolean(user?.role?.includes('editor'))
}