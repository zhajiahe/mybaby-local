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
 * 将字符串转换为 Uint8Array
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

/**
 * 将 ArrayBuffer 转换为十六进制字符串
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 使用 Web Crypto API 计算 HMAC-SHA256
 */
async function hmacSha256(key: string, message: string): Promise<string> {
  const keyData = stringToUint8Array(key)
  const messageData = stringToUint8Array(message)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData.buffer as ArrayBuffer
  )
  
  return arrayBufferToHex(signature)
}

/**
 * 生成认证 token (异步版本)
 * 格式: {expireAt}.{signature}
 * signature = HMAC-SHA256(expireAt, password)
 */
export async function generateAuthToken(password: string): Promise<string> {
  const expireAt = Date.now() + AUTH_COOKIE_MAX_AGE * 1000
  const signature = await hmacSha256(password, expireAt.toString())
  return `${expireAt}.${signature}`
}

/**
 * 验证认证 token (异步版本)
 */
export async function verifyAuthToken(token: string, password: string): Promise<boolean> {
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
  const expectedSignature = await hmacSha256(password, expireAtStr)
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
