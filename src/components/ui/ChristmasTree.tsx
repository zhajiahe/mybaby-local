'use client'

import { useState, useEffect } from 'react'

interface ChristmasTreeProps {
  onClose: () => void
}

export function ChristmasTree({ onClose }: ChristmasTreeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // 入场动画
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(), 500)
  }

  // 生成随机雪花
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDuration: 3 + Math.random() * 5,
    animationDelay: Math.random() * 5,
    size: 4 + Math.random() * 8,
  }))

  // 树上的装饰球
  const ornaments = [
    { color: '#ff4757', top: '25%', left: '45%' },
    { color: '#ffa502', top: '35%', left: '30%' },
    { color: '#3742fa', top: '35%', left: '60%' },
    { color: '#ff6b81', top: '48%', left: '25%' },
    { color: '#70a1ff', top: '48%', left: '65%' },
    { color: '#ffeaa7', top: '45%', left: '45%' },
    { color: '#ff4757', top: '60%', left: '20%' },
    { color: '#2ed573', top: '58%', left: '50%' },
    { color: '#ffa502', top: '62%', left: '72%' },
    { color: '#3742fa', top: '72%', left: '15%' },
    { color: '#ff6b81', top: '70%', left: '40%' },
    { color: '#70a1ff', top: '75%', left: '60%' },
    { color: '#ffeaa7', top: '73%', left: '78%' },
  ]

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isVisible && !isLeaving ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        background: 'linear-gradient(180deg, #0c1445 0%, #1a237e 50%, #283593 100%)',
        pointerEvents: isLeaving ? 'none' : 'auto'
      }}
    >
      {/* 雪花 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white opacity-80 animate-snowfall"
            style={{
              left: `${flake.left}%`,
              top: '-20px',
              fontSize: `${flake.size}px`,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.animationDelay}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* 主内容 */}
      <div 
        className={`text-center transform transition-all duration-700 ${
          isVisible && !isLeaving ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'
        }`}
      >
        {/* 祝福语 */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 animate-pulse">
          🎄 Merry Christmas! 🎄
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-6">
          祝小好和家人圣诞快乐！
        </p>

        {/* 圣诞树 */}
        <div className="relative w-48 h-64 md:w-64 md:h-80 mx-auto mb-6">
          {/* 星星 */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-4xl md:text-5xl animate-twinkle"
            style={{ filter: 'drop-shadow(0 0 10px #ffd700)' }}
          >
            ⭐
          </div>

          {/* 树冠层1 */}
          <div 
            className="absolute top-6 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: '60px solid #2d5a27',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* 树冠层2 */}
          <div 
            className="absolute top-14 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '55px solid transparent',
              borderRight: '55px solid transparent',
              borderBottom: '70px solid #388e3c',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* 树冠层3 */}
          <div 
            className="absolute top-24 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '70px solid transparent',
              borderRight: '70px solid transparent',
              borderBottom: '80px solid #43a047',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* 树冠层4 */}
          <div 
            className="absolute top-36 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '85px solid transparent',
              borderRight: '85px solid transparent',
              borderBottom: '90px solid #4caf50',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* 树干 */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-10 h-10 md:h-12 bg-amber-800 rounded-sm"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />

          {/* 装饰球 */}
          {ornaments.map((ornament, index) => (
            <div
              key={index}
              className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full animate-twinkle"
              style={{
                backgroundColor: ornament.color,
                top: ornament.top,
                left: ornament.left,
                boxShadow: `0 0 8px ${ornament.color}`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}

          {/* 彩灯串 */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full">
            {[0, 1, 2, 3].map((row) => (
              <div 
                key={row} 
                className="flex justify-center gap-2 md:gap-3 mb-4"
                style={{ 
                  width: `${60 + row * 30}%`,
                  marginLeft: `${20 - row * 15}%`,
                }}
              >
                {Array.from({ length: 3 + row }, (_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-blink"
                    style={{
                      backgroundColor: ['#ff4757', '#ffa502', '#2ed573', '#3742fa', '#ff6b81'][i % 5],
                      boxShadow: `0 0 6px ${['#ff4757', '#ffa502', '#2ed573', '#3742fa', '#ff6b81'][i % 5]}`,
                      animationDelay: `${(row * 4 + i) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 礼物盒 */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎁</div>
          <div className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</div>
          <div className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎁</div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all duration-200 backdrop-blur-sm border border-white/30"
        >
          进入小好小宇宙 🚀
        </button>
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.9);
          }
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ChristmasTree

