'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Heart, Baby, Sparkles, Lock } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const from = searchParams.get('from') || '/'

  // 错误时触发抖动动画
  useEffect(() => {
    if (error) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('请输入密码')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      })

      const data = await res.json()

      if (data.success) {
        router.replace(from)
      } else {
        setError(data.message || '密码错误')
        setPassword('')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* 浮动装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] opacity-20 dark:opacity-10">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute top-[20%] right-[15%] opacity-20 dark:opacity-10">
          <Baby className="w-20 h-20 text-teal-400 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-[15%] left-[20%] opacity-20 dark:opacity-10">
          <Sparkles className="w-14 h-14 text-amber-400 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-[25%] right-[10%] opacity-20 dark:opacity-10">
          <Heart className="w-12 h-12 text-rose-400 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* 登录卡片 */}
      <div
        className={`
          relative w-full max-w-md
          bg-white/80 dark:bg-slate-800/90
          backdrop-blur-xl
          rounded-3xl
          shadow-2xl shadow-teal-500/10 dark:shadow-black/30
          border border-white/50 dark:border-slate-700/50
          p-8 md:p-10
          animate-scale-in
          ${shake ? 'animate-shake' : ''}
        `}
      >
        {/* 顶部图标 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Baby className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            宝贝成长日记
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            输入密码以访问记录
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 密码输入框 */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="请输入访问密码"
              className={`
                w-full
                px-5 py-4 pr-12
                bg-gray-50 dark:bg-slate-700/50
                border-2 rounded-2xl
                text-gray-800 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                transition-all duration-200
                outline-none
                ${error
                  ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-4 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-slate-600 focus:border-teal-400 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20'
                }
              `}
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full
              py-4 px-6
              bg-gradient-to-r from-teal-500 to-cyan-500
              hover:from-teal-600 hover:to-cyan-600
              text-white font-medium
              rounded-2xl
              shadow-lg shadow-teal-500/30
              transition-all duration-200
              flex items-center justify-center gap-2
              ${isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>验证中...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>进入日记</span>
              </>
            )}
          </button>
        </form>

        {/* 底部提示 */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          验证通过后，7 天内无需再次输入密码
        </p>
      </div>

      {/* 抖动动画样式 */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  )
}

