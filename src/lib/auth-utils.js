import { CONFIG } from './config'

export function isAdminUser(user) {
  if (!user || !user.email) return false
  return CONFIG.ADMIN.EMAILS.includes(user.email.toLowerCase())
}
