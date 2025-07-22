import type { Access } from 'payload'
import { User } from '@/payload-types'

export const isUserAccess: Access = ({ req }): boolean => {
    return isUser(req.user)
}

export const isUser = (user: User | null): boolean => {
    return Boolean(user?.role?.includes('user'))
}