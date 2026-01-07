import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'

// 不需要认证的路径
const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const password = process.env.ACCESS_PASSWORD?.trim()

  // 未设置密码，跳过认证
  if (!password) {
    return NextResponse.next()
  }

  // 公开路径不需要认证
  if (isPublicPath(pathname)) {
    // 如果已登录且访问登录页，重定向到首页
    if (pathname === '/login') {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
      if (token && await verifyAuthToken(token, password)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return NextResponse.next()
  }

  // 验证 token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token || !await verifyAuthToken(token, password)) {
    // 未认证，重定向到登录页
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
