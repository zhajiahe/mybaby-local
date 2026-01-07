import { Suspense } from 'react'
import LoginForm from './LoginForm'

// 加载状态组件
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-48" />
          <div className="h-4 bg-gray-100 dark:bg-slate-600 rounded animate-pulse mx-auto w-32" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
