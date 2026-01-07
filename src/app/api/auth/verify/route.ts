import { NextRequest, NextResponse } from 'next/server'
import {
  verifyPassword,
  generateAuthToken,
  getAccessPassword,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: '请输入密码' },
        { status: 400 }
      )
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      )
    }

    // 生成 token
    const accessPassword = getAccessPassword()
    if (!accessPassword) {
      // 未设置密码，不应该到达这里
      return NextResponse.json({ success: true })
    }

    const token = generateAuthToken(accessPassword)

    // 设置 cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

