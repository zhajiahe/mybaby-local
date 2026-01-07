import { createHmac } from 'crypto'

// Cookie 配置
export const AUTH_COOKIE_NAME = 'baby_access_token'
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 天（秒）

/**
 * 获取访问密码
 */
export function getAccessPassword(): string | undefined {
  const password = process.env.ACCESS_PASSWORD
  return password && password.trim() ? password.trim() : undefined
}

/**
 * 检查是否启用了密码保护
 */
export function isAuthEnabled(): boolean {
  return !!getAccessPassword()
}

/**
 * 生成认证 token
 * 格式: {expireAt}.{signature}
 * signature = HMAC-SHA256(expireAt, password)
 */
export function generateAuthToken(password: string): string {
  const expireAt = Date.now() + AUTH_COOKIE_MAX_AGE * 1000
  const signature = createHmac('sha256', password)
    .update(expireAt.toString())
    .digest('hex')
  return `${expireAt}.${signature}`
}

/**
 * 验证认证 token
 */
export function verifyAuthToken(token: string, password: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) {
    return false
  }

  const [expireAtStr, signature] = parts
  const expireAt = parseInt(expireAtStr, 10)

  // 检查是否过期
  if (isNaN(expireAt) || Date.now() > expireAt) {
    return false
  }

  // 验证签名
  const expectedSignature = createHmac('sha256', password)
    .update(expireAtStr)
    .digest('hex')

  return signature === expectedSignature
}

/**
 * 验证密码是否正确
 */
export function verifyPassword(inputPassword: string): boolean {
  const password = getAccessPassword()
  if (!password) {
    return true // 未设置密码，直接通过
  }
  return inputPassword === password
}

