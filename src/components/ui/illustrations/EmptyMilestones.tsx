'use client'

interface EmptyMilestonesProps {
  className?: string
}

export function EmptyMilestones({ className = '' }: EmptyMilestonesProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景装饰 */}
      <circle cx="30" cy="50" r="8" fill="#fef3c7" />
      <circle cx="170" cy="40" r="6" fill="#ccfbf1" />
      <circle cx="160" cy="130" r="10" fill="#fce7f3" />
      
      {/* 奖杯底座 */}
      <rect x="75" y="120" width="50" height="15" rx="3" fill="#d97706" />
      <rect x="80" y="110" width="40" height="15" rx="2" fill="#f59e0b" />
      
      {/* 奖杯主体 */}
      <path
        d="M70 50 C70 40, 80 35, 100 35 C120 35, 130 40, 130 50 L125 95 C125 100, 115 110, 100 110 C85 110, 75 100, 75 95 Z"
        fill="#fbbf24"
      />
      <path
        d="M75 50 C75 42, 83 38, 100 38 C117 38, 125 42, 125 50 L121 92 C121 96, 113 105, 100 105 C87 105, 79 96, 79 92 Z"
        fill="#fcd34d"
      />
      
      {/* 奖杯手柄 */}
      <path
        d="M70 55 C55 55, 50 65, 55 75 C60 85, 70 85, 70 80"
        stroke="#d97706"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M130 55 C145 55, 150 65, 145 75 C140 85, 130 85, 130 80"
        stroke="#d97706"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* 星星装饰 */}
      <path d="M100 55 L103 62 L111 63 L105 69 L107 77 L100 73 L93 77 L95 69 L89 63 L97 62 Z" fill="white" />
      
      {/* 闪光效果 */}
      <path d="M88 45 L90 40 L92 45 L97 47 L92 49 L90 54 L88 49 L83 47 Z" fill="white" opacity="0.8" />
      <path d="M110 48 L111 45 L112 48 L115 49 L112 50 L111 53 L110 50 L107 49 Z" fill="white" opacity="0.6" />
      
      {/* 彩带 */}
      <path
        d="M65 45 Q50 55, 55 70 Q60 85, 45 95"
        stroke="#f0abfc"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M135 45 Q150 55, 145 70 Q140 85, 155 95"
        stroke="#14b8a6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* 散落的星星 */}
      <circle cx="40" cy="80" r="2" fill="#fbbf24" />
      <circle cx="55" cy="100" r="1.5" fill="#f0abfc" />
      <circle cx="145" cy="90" r="2" fill="#14b8a6" />
      <circle cx="160" cy="75" r="1.5" fill="#fbbf24" />
    </svg>
  )
}

export default EmptyMilestones

