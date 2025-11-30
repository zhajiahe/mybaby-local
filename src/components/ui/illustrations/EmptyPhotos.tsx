'use client'

interface EmptyPhotosProps {
  className?: string
}

export function EmptyPhotos({ className = '' }: EmptyPhotosProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景云朵 */}
      <ellipse cx="40" cy="30" rx="25" ry="15" fill="#e0f2fe" />
      <ellipse cx="55" cy="25" rx="20" ry="12" fill="#e0f2fe" />
      <ellipse cx="160" cy="40" rx="22" ry="13" fill="#e0f2fe" />
      <ellipse cx="175" cy="35" rx="18" ry="10" fill="#e0f2fe" />

      {/* 相机主体 */}
      <rect x="55" y="55" width="90" height="70" rx="12" fill="#14b8a6" />
      <rect x="60" y="60" width="80" height="60" rx="8" fill="#0d9488" />
      
      {/* 镜头 */}
      <circle cx="100" cy="90" r="22" fill="#1e293b" />
      <circle cx="100" cy="90" r="18" fill="#334155" />
      <circle cx="100" cy="90" r="12" fill="#475569" />
      <circle cx="100" cy="90" r="6" fill="#64748b" />
      <circle cx="96" cy="86" r="3" fill="#94a3b8" opacity="0.6" />
      
      {/* 闪光灯 */}
      <rect x="115" y="62" width="20" height="10" rx="3" fill="#fbbf24" />
      
      {/* 快门按钮 */}
      <circle cx="130" cy="52" r="6" fill="#f43f5e" />
      <circle cx="130" cy="52" r="4" fill="#fb7185" />
      
      {/* 取景器 */}
      <rect x="70" y="62" width="15" height="10" rx="2" fill="#1e293b" />
      
      {/* 照片叠加效果 */}
      <g transform="rotate(-8 100 130)">
        <rect x="50" y="100" width="60" height="45" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="55" y="105" width="50" height="30" rx="2" fill="#f1f5f9" />
      </g>
      <g transform="rotate(5 100 130)">
        <rect x="90" y="95" width="60" height="45" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="95" y="100" width="50" height="30" rx="2" fill="#f1f5f9" />
      </g>
      
      {/* 装饰星星 */}
      <path d="M30 80 L32 75 L34 80 L39 82 L34 84 L32 89 L30 84 L25 82 Z" fill="#fbbf24" />
      <path d="M170 70 L171.5 66 L173 70 L177 71.5 L173 73 L171.5 77 L170 73 L166 71.5 Z" fill="#fbbf24" />
      <path d="M150 120 L151 117 L152 120 L155 121 L152 122 L151 125 L150 122 L147 121 Z" fill="#f0abfc" />
    </svg>
  )
}

export default EmptyPhotos

